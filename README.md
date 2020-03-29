# Caesar-cipher-CLI-tool

## How to install and start

- Install [Node.js](https://nodejs.org/en/)
- Clone this repository: `https://github.com/jamask/Caesar-cipher-CLI-tool`
- Run `npm install` in command line
- Go to folder `task1`
- node my_caesar_cli

## CLI tool should accept 4 options (short alias and full name)::

-s, --shift: a shift (required)
-i, --input: an input file
-o, --output: an output file
-a, --action: an action encode/decode (required)

## Usage example:

```bash
$ node my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"
```

```bash
$ node my_caesar_cli --action encode --shift 7 --input plain.txt --output encoded.txt
```

```bash
$ node my_caesar_cli --action decode --shift 7 --input decoded.txt --output plain.txt
```