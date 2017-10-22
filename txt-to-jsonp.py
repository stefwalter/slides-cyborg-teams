#!/bin/python

import argparse
import csv
import json
import sys

def main():
    parser = argparse.ArgumentParser(description='Convert CSV to JSONP')
    parser.add_argument("identifier", help="Identifier for package")
    opts = parser.parse_args()

    results = [ ]
    columns = None

    reader = csv.reader(sys.stdin, delimiter=',', skipinitialspace=True)
    for row in reader:
        if not len(row):
            continue
        if not columns:
            columns = row
        else:
            result = { }
            for i, item in enumerate(row):
                result[columns[i]] = item.strip()
            results.append(result)

    sys.stdout.write("{0}(".format(opts.identifier))
    json.dump(results, sys.stdout, indent=4)
    sys.stdout.write(");");

if __name__ == '__main__':
    sys.exit(main())
