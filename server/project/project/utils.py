def format_currency(num_value, with_symbol=True):
    str_value = '{:,.2f}'.format(num_value)
    if str_value.startswith('-'):
        str_value = '(' + str_value[1:] + ')'

    if not with_symbol:
        return str_value

    return '$' + str_value
