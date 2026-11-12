function format_name(first, last) {
    return [first, last].filter(Boolean).join(' ');
}

module.exports = { format_name };
