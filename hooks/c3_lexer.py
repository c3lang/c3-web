import sys
import os
from pygments.lexer import RegexLexer, include, words, bygroups
from pygments.token import Text, Comment, Operator, Keyword, Name, String, Number, Punctuation, Generic

__all__ = ['C3Lexer']

class C3Lexer(RegexLexer):
    name = 'C3'
    aliases = ['c3']
    filenames = ['*.c3', '*.c3i', '*.c3t']

    tokens = {
        'root': [
            (r'\s+', Text),
            # Comments
            (r'/\*\*.*?\*/', Comment.Doc),
            (r'/\*.*?\*/', Comment.Multiline),
            (r'//.*?$', Comment.Single),

            # Keywords
            (words((
                'any', 'bfloat', 'bool', 'char', 'double', 'fault', 'float',
                'float128', 'float16', 'ichar', 'int', 'int128', 'iptr', 'isz',
                'long', 'short', 'typeid', 'uint', 'uint128', 'ulong', 'uptr',
                'ushort', 'usz', 'void'
            ), suffix=r'\b'), Keyword.Type),

            (words((
                'alias', 'assert', 'asm', 'attrdef', 'bitstruct', 'break',
                'case', 'catch', 'const', 'continue', 'default', 'defer',
                'do', 'else', 'enum', 'extern', 'false', 'faultdef', 'fn',
                'for', 'tlocal', 'if', 'inline', 'import', 'macro', 'module',
                'nextcase', 'null', 'interface', 'return', 'static', 'struct',
                'switch', 'true', 'try', 'typedef', 'union', 'var', 'while',
                'foreach', 'foreach_r'
            ), suffix=r'\b'), Keyword),

            # Built-ins, Compile-time, and Allocation
            (words((
                'malloc', 'calloc', 'realloc', 'free',
                'tmalloc', 'tcalloc', 'trealloc',
                'malloc_aligned', 'free_aligned',
                'new', 'alloc', 'new_array', 'alloc_array'
            ), suffix=r'\b'), Name.Builtin),
            (r'\${1,2}[a-zA-Z_][a-zA-Z0-9_]*', Name.Builtin),
            (r'@[a-zA-Z_][a-zA-Z0-9_]*', Name.Decorator),

            # Function calls
            (r'([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(\()', bygroups(Name.Function, Text, Punctuation)),

            # Types (User defined - usually CamelCase)
            (r'\b[A-Z][a-zA-Z0-9_]*\b', Name.Class),

            # Identifiers
            (r'[a-zA-Z_][a-zA-Z0-9_]*', Name),

            # Numbers
            (r'0x[0-9a-fA-F_]+', Number.Hex),
            (r'0b[01_]+', Number.Bin),
            (r'0o[0-7_]+', Number.Oct),
            (r'[0-9][0-9_]*\.[0-9_]*([eE][+-]?[0-9_]+)?', Number.Float),
            (r'[0-9][0-9_]*', Number.Integer),

            # Strings and Chars
            (r'"', String, 'string'),
            (r'\'', String.Char, 'char'),

            # Operators
            (r'(\.\.\.|==|!=|<=|>=|<<|>>|&&|\|\||\+\+|--|\+=|-=|\*=|/=|%=|&=|\|=|\^=|<<=|>>=|=>|->|\.\.|::|[~+*/%&|^=<>!?.!])', Operator),

            # Punctuation
            (r'[()\[\]{},.;]', Punctuation),
        ],
        'string': [
            (r'[^\\"]+', String),
            (r'\\([\\abfnrtv"\']|x[a-fA-F0-9]{2,4}|u[a-fA-F0-9]{4}|U[a-fA-F0-9]{8}|[0-7]{1,3})', String.Escape),
            (r'"', String, '#pop'),
        ],
        'char': [
            (r'[^\\\'\n]', String.Char),
            (r'\\([\\abfnrtv"\']|x[a-fA-F0-9]{2,4}|u[a-fA-F0-9]{4}|U[a-fA-F0-9]{8}|[0-7]{1,3})', String.Escape),
            (r'\'', String.Char, '#pop'),
        ],
    }

# MkDocs hook to register the lexer
def on_config(config, **kwargs):
    import pygments.lexers
    pygments.lexers.LEXERS["C3Lexer"] = (
        "c3_lexer", "C3", ("c3",), ("*.c3", "*.c3i", "*.c3t"), ("text/x-c3src",)
    )
    sys.modules["c3_lexer"] = sys.modules[__name__]
    print("C3 Lexer registered via hook.")
    return config
