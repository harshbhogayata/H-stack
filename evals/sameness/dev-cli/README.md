# logq

logq is a tool that we made to help with logs, it is a command line tool written in Node and it can do a lot of things with your log files.

## Install

    npm i -g logq

## Usage

    logq run 'level=error service=api' app.log
    logq run --json 'status>=500' access.log | jq .
    logq saved add errors 'level=error'
    logq saved run errors app.log

## Exit codes

    0  matches found
    1  no matches
    2  usage error
