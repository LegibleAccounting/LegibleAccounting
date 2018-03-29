def format_currency(num_value):
    str_value = '{:,.2f}'.format(num_value)
    if str_value.startswith('-'):
        return '($' + str_value[1:] + ')'

    return '$' + str_value
