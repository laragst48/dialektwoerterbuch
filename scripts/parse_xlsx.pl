#!/usr/bin/env perl
# Parst eine .xlsx-Datei ohne externe Abhängigkeiten (nur unzip + XML).
use strict;
use warnings;
use utf8;
use open qw(:std :utf8);

my $xlsx = $ARGV[0] or die "Usage: parse_xlsx.pl file.xlsx\n";
my $tmp = `mktemp -d`;
chomp $tmp;
system('unzip', '-q', '-o', $xlsx, '-d', $tmp) == 0 or die "unzip failed\n";

sub read_xml {
    my ($path) = @_;
    open my $fh, '<:encoding(UTF-8)', $path or die $!;
    local $/;
    my $data = <$fh>;
    close $fh;
    return $data;
}

sub decode_xml_entities {
    my ($text) = @_;
    $text =~ s/&lt;/</g;
    $text =~ s/&gt;/>/g;
    $text =~ s/&amp;/&/g;
    $text =~ s/&quot;/"/g;
    $text =~ s/&#(\d+);/chr($1)/ge;
    $text =~ s/&#x([0-9a-fA-F]+);/chr(hex($1))/ge;
    return $text;
}

my $sst_xml = read_xml("$tmp/xl/sharedStrings.xml");
my @shared;
while ($sst_xml =~ /<si>(.*?)<\/si>/gs) {
    my $block = $1;
    my $text = '';
    while ($block =~ /<t(?:\s[^>]*)?>(.*?)<\/t>/gs) {
        $text .= decode_xml_entities($1);
    }
    push @shared, $text;
}

sub col_index {
    my ($col) = @_;
    my $n = 0;
    for my $c (split //, uc($col)) {
        $n = $n * 26 + (ord($c) - 64);
    }
    return $n - 1;
}

my $sheet_xml = read_xml("$tmp/xl/worksheets/sheet1.xml");
my %cells;
while ($sheet_xml =~ /<c r="([A-Z]+)(\d+)"([^>]*)>(.*?)<\/c>/gs) {
    my ($col, $row, $attrs, $inner) = ($1, $2, $3, $4);
    my $val = '';
    if ($attrs =~ /t="s"/) {
        ($val) = $inner =~ /<v>(\d+)<\/v>/;
        $val = $shared[$val] // '';
    } elsif ($attrs =~ /t="inlineStr"/) {
        ($val) = $inner =~ /<t>(.*?)<\/t>/s;
        $val = decode_xml_entities($val // '');
    } else {
        ($val) = $inner =~ /<v>(.*?)<\/v>/;
    }
    $cells{"$row," . col_index($col)} = $val // '';
}

system('rm', '-rf', $tmp);

my $max_row = 0;
for my $key (keys %cells) {
    my ($r) = split /,/, $key;
    $max_row = $r if $r > $max_row;
}

sub json_escape {
    my ($s) = @_;
    $s //= '';
    $s =~ s/\\/\\\\/g;
    $s =~ s/"/\\"/g;
    $s =~ s/\n/\\n/g;
    $s =~ s/\r//g;
    $s =~ s/\t/\\t/g;
    return $s;
}

my @words;
for my $row (2 .. $max_row) {
    my @row_vals = map { $cells{"$row,$_"} // '' } 0 .. 6;
    my ($schrift, $mundart, $bedeutung, $audio, $sprecher, $ort, $datum) = @row_vals;
    next unless $schrift || $mundart;

    push @words, {
        id => 'word-' . (scalar(@words) + 1),
        schriftdeutsch => $schrift,
        mundart => $mundart,
        bedeutung => $bedeutung,
        audioDatei => $audio,
        sprecher => $sprecher,
        ort => $ort || 'Groß-Umstadt',
        datum => $datum,
    };
}

print "[\n";
for my $i (0 .. $#words) {
    my $w = $words[$i];
    my $comma = $i < $#words ? ',' : '';
    printf(
        "  {\"id\":\"%s\",\"schriftdeutsch\":\"%s\",\"mundart\":\"%s\",\"bedeutung\":\"%s\",\"audioDatei\":\"%s\",\"sprecher\":\"%s\",\"ort\":\"%s\",\"datum\":\"%s\"}%s\n",
        json_escape($w->{id}),
        json_escape($w->{schriftdeutsch}),
        json_escape($w->{mundart}),
        json_escape($w->{bedeutung}),
        json_escape($w->{audioDatei}),
        json_escape($w->{sprecher}),
        json_escape($w->{ort}),
        json_escape($w->{datum}),
        $comma
    );
}
print "]\n";

print STDERR "Parsed " . scalar(@words) . " words from $xlsx\n";
