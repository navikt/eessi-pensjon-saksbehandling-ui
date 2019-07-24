import _ from 'lodash'

class CountryData {
  countries = {
    'en': [
      {
        'value': 'NO',
        'value3': 'NOR',
        'label': 'Norway',
        'currency': 'NOK',
        'currencyLabel': 'Norwegian korner'
      }, {
        'value': 'SE',
        'value3': 'SWE',
        'label': 'Sweden',
        'currency': 'SEK',
        'currencyLabel': 'Swedish korner'
      }, {
        'value': 'DK',
        'value3': 'DNK',
        'label': 'Denmark',
        'currency': 'DKK',
        'currencyLabel': 'Danish korner'
      }, {
        'value': 'AF',
        'label': 'Afghanistan',
        'currency': 'AFN',
        'currencyLabel': 'Afghani'
      }, {
        'value': 'AX',
        'label': 'Åland Islands'
      }, {
        'value': 'AL',
        'label': 'Albania',
        'currency': 'ALL',
        'currencyLabel': 'Albanian Lek'
      }, {
        'value': 'DZ',
        'label': 'Algeria',
        'currency': 'DZD',
        'currencyLabel': 'Algerian Dinar'
      }, {
        'value': 'AS',
        'label': 'American Samoa',
        'currency': 'USD',
        'currencyLabel': 'US Dollar'
      }, {
        'value': 'AD',
        'label': 'Andorra',
        'currency': 'EUR',
        'currencyLabel': 'Euro'
      }, {
        'value': 'AO',
        'label': 'Angola',
        'currencyLabel': 'Kwanza',
        'currency': 'AOA'
      }, {
        'value': 'AI',
        'label': 'Anguilla',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'AQ',
        'label': 'Antarctica',
        'currencyLabel': 'No currency',
        'currency': ''
      }, {
        'value': 'AG',
        'label': 'Antigua and Barbuda',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'AR',
        'label': 'Argentina',
        'currencyLabel': 'Argentine Peso',
        'currency': 'ARS'
      }, {
        'value': 'AM',
        'label': 'Armenia',
        'currencyLabel': 'Armenian Dram',
        'currency': 'AMD'
      }, {
        'value': 'AW',
        'label': 'Aruba',
        'currencyLabel': 'Aruban Florin',
        'currency': 'AWG'
      }, {
        'value': 'AU',
        'label': 'Australia',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'AT',
        'label': 'Austria',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'AZ',
        'label': 'Azerbaijan',
        'currencyLabel': 'Azerbaijanian Manat',
        'currency': 'AZN'
      }, {
        'value': 'BS',
        'label': 'The Bahamas',
        'currencyLabel': 'Bahamian Dollar',
        'currency': 'BSD'
      }, {
        'value': 'BH',
        'label': 'Bahrain',
        'currencyLabel': 'Bahraini Dinar',
        'currency': 'BHD'
      }, {
        'value': 'BD',
        'label': 'Bangladesh',
        'currencyLabel': 'Taka',
        'currency': 'BDT'
      }, {
        'value': 'BB',
        'label': 'Barbados',
        'currencyLabel': 'Barbados Dollar',
        'currency': 'BBD'
      }, {
        'value': 'BY',
        'label': 'Belarus',
        'currencyLabel': 'Belarussian Ruble',
        'currency': 'BYR'
      }, {
        'value': 'BE',
        'label': 'Belgium',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'BZ',
        'label': 'Belize',
        'currencyLabel': 'Belize Dollar',
        'currency': 'BZD'
      }, {
        'value': 'BJ',
        'label': 'Benin',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'BM',
        'label': 'Bermuda',
        'currencyLabel': 'Bermudian Dollar',
        'currency': 'BMD'
      }, {
        'value': 'BT',
        'label': 'Bhutan',
        'currencyLabel': 'Ngultrum',
        'currency': 'BTN'
      }, {
        'value': 'BT',
        'label': 'Bhutan',
        'currencyLabel': 'Indian Rupee',
        'currency': 'INR'
      }, {
        'value': 'BO',
        'label': 'Bolivia',
        'currencyLabel': 'Boliviano',
        'currency': 'BOB'
      }, {
        'value': 'BO',
        'label': 'Bolivia',
        'currencyLabel': 'Mvdol',
        'currency': 'BOV'
      }, {
        'value': 'BQ',
        'label': 'Bonaire',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'BA',
        'label': 'Bosnia and Herzegovina',
        'currencyLabel': 'Convertible Mark',
        'currency': 'BAM'
      }, {
        'value': 'BW',
        'label': 'Botswana',
        'currencyLabel': 'Pula',
        'currency': 'BWP'
      }, {
        'value': 'BV',
        'label': 'Bouvet Island',
        'currencyLabel': 'Norwegian Krone',
        'currency': 'NOK'
      }, {
        'value': 'BR',
        'label': 'Brazil',
        'currencyLabel': 'Brazilian Real',
        'currency': 'BRL'
      }, {
        'value': 'IO',
        'label': 'British Indian Ocean Territory',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'UM',
        'label': 'United States Minor Outlying Islands',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'VG',
        'label': 'Virgin Islands (British)',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'VI',
        'label': 'Virgin Islands (U.S.)',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'BN',
        'label': 'Brunei',
        'currencyLabel': 'Brunei Dollar',
        'currency': 'BND'
      }, {
        'value': 'BG',
        'label': 'Bulgaria',
        'currencyLabel': 'Bulgarian Lev',
        'currency': 'BGN'
      }, {
        'value': 'BF',
        'label': 'Burkina Faso',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'BI',
        'label': 'Burundi',
        'currencyLabel': 'Burundi Franc',
        'currency': 'BIF'
      }, {
        'value': 'KH',
        'label': 'Cambodia',
        'currencyLabel': 'Riel',
        'currency': 'KHR'
      }, {
        'value': 'CM',
        'label': 'Cameroon',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'CA',
        'label': 'Canada',
        'currencyLabel': 'Canadian Dollar',
        'currency': 'CAD'
      }, {
        'value': 'CV',
        'label': 'Cape Verde',
        'currencyLabel': 'Cabo Verde Escudo',
        'currency': 'CVE'
      }, {
        'value': 'KY',
        'label': 'Cayman Islands',
        'currencyLabel': 'Cayman Islands Dollar',
        'currency': 'KYD'
      }, {
        'value': 'CF',
        'label': 'Central African Republic',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'TD',
        'label': 'Chad',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'CL',
        'label': 'Chile',
        'currencyLabel': 'Chilean Peso',
        'currency': 'CLP'
      }, {
        'value': 'CN',
        'label': 'China',
        'currencyLabel': 'Yuan Renminbi',
        'currency': 'CNY'
      }, {
        'value': 'CX',
        'label': 'Christmas Island',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'CC',
        'label': 'Cocos (Keeling) Islands',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'CO',
        'label': 'Colombia',
        'currencyLabel': 'Colombian Peso',
        'currency': 'COP'
      }, {
        'value': 'KM',
        'label': 'Comoros',
        'currencyLabel': 'Comoro Franc',
        'currency': 'KMF'
      }, {
        'value': 'CG',
        'label': 'Republic of the Congo',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'CD',
        'label': 'Democratic Republic of the Congo',
        'currencyLabel': 'Congolese Franc',
        'currency': 'CDF'
      }, {
        'value': 'CK',
        'label': 'Cook Islands',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'CR',
        'label': 'Costa Rica',
        'currencyLabel': 'Costa Rican Colon',
        'currency': 'CRC'
      }, {
        'value': 'HR',
        'label': 'Croatia',
        'currencyLabel': 'Kuna',
        'currency': 'HRK'
      }, {
        'value': 'CU',
        'label': 'Cuba',
        'currencyLabel': 'Cuban Peso',
        'currency': 'CUP'
      }, {
        'value': 'CW',
        'label': 'Curaçao',
        'currencyLabel': 'Netherlands Antillean Guilder',
        'currency': 'ANG'
      }, {
        'value': 'CY',
        'label': 'Cyprus',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'CZ',
        'label': 'Czech Republic',
        'currencyLabel': 'Czech Koruna',
        'currency': 'CZK'
      }, {
        'value': 'DJ',
        'label': 'Djibouti',
        'currencyLabel': 'Djibouti Franc',
        'currency': 'DJF'
      }, {
        'value': 'DM',
        'label': 'Dominica',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'DO',
        'label': 'Dominican Republic',
        'currencyLabel': 'Dominican Peso',
        'currency': 'DOP'
      }, {
        'value': 'EC',
        'label': 'Ecuador',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'EG',
        'label': 'Egypt',
        'currencyLabel': 'Egyptian Pound',
        'currency': 'EGP'
      }, {
        'value': 'SV',
        'label': 'El Salvador',
        'currencyLabel': 'El Salvador Colon',
        'currency': 'SVC'
      }, {
        'value': 'GQ',
        'label': 'Equatorial Guinea',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'ER',
        'label': 'Eritrea',
        'currencyLabel': 'Nakfa',
        'currency': 'ERN'
      }, {
        'value': 'EE',
        'label': 'Estonia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'ET',
        'label': 'Ethiopia',
        'currencyLabel': 'Ethiopian Birr',
        'currency': 'ETB'
      }, {
        'value': 'FK',
        'label': 'Falkland Islands',
        'currencyLabel': 'Falkland Islands Pound',
        'currency': 'FKP'
      }, {
        'value': 'FO',
        'label': 'Faroe Islands',
        'currencyLabel': 'Danish Krone',
        'currency': 'DKK'
      }, {
        'value': 'FJ',
        'label': 'Fiji',
        'currencyLabel': 'Fiji Dollar',
        'currency': 'FJD'
      }, {
        'value': 'FI',
        'label': 'Finland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'FR',
        'label': 'France',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GF',
        'label': 'French Guiana',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PF',
        'label': 'French Polynesia',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'TF',
        'label': 'French Southern and Antarctic Lands',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GA',
        'label': 'Gabon',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'GM',
        'label': 'The Gambia',
        'currencyLabel': 'Dalasi',
        'currency': 'GMD'
      }, {
        'value': 'GE',
        'label': 'Georgia',
        'currencyLabel': 'Lari',
        'currency': 'GEL'
      }, {
        'value': 'DE',
        'label': 'Germany',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GH',
        'label': 'Ghana',
        'currencyLabel': 'Ghana Cedi',
        'currency': 'GHS'
      }, {
        'value': 'GI',
        'label': 'Gibraltar',
        'currencyLabel': 'Gibraltar Pound',
        'currency': 'GIP'
      }, {
        'value': 'GR',
        'label': 'Greece',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GL',
        'label': 'Greenland',
        'currencyLabel': 'Danish Krone',
        'currency': 'DKK'
      }, {
        'value': 'GD',
        'label': 'Grenada',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'GP',
        'label': 'Guadeloupe',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GU',
        'label': 'Guam',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'GT',
        'label': 'Guatemala',
        'currencyLabel': 'Quetzal',
        'currency': 'GTQ'
      }, {
        'value': 'GG',
        'label': 'Guernsey',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'GW',
        'label': 'Guinea-Bissau',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'GY',
        'label': 'Guyana',
        'currencyLabel': 'Guyana Dollar',
        'currency': 'GYD'
      }, {
        'value': 'HT',
        'label': 'Haiti',
        'currencyLabel': 'Gourde',
        'currency': 'HTG'
      }, {
        'value': 'HM',
        'label': 'Heard Island and McDonald Islands',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'VA',
        'label': 'Holy See',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'HN',
        'label': 'Honduras',
        'currencyLabel': 'Lempira',
        'currency': 'HNL'
      }, {
        'value': 'HK',
        'label': 'Hong Kong',
        'currencyLabel': 'Hong Kong Dollar',
        'currency': 'HKD'
      }, {
        'value': 'HU',
        'label': 'Hungary',
        'currencyLabel': 'Forint',
        'currency': 'HUF'
      }, {
        'value': 'IS',
        'label': 'Iceland',
        'currencyLabel': 'Iceland Krona',
        'currency': 'ISK'
      }, {
        'value': 'IN',
        'label': 'India',
        'currencyLabel': 'Indian Rupee',
        'currency': 'INR'
      }, {
        'value': 'ID',
        'label': 'Indonesia',
        'currencyLabel': 'Rupiah',
        'currency': 'IDR'
      }, {
        'value': 'CI',
        'label': 'Ivory Coast',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'IR',
        'label': 'Iran',
        'currencyLabel': 'Iranian Rial',
        'currency': 'IRR'
      }, {
        'value': 'IQ',
        'label': 'Iraq',
        'currencyLabel': 'Iraqi Dinar',
        'currency': 'IQD'
      }, {
        'value': 'IE',
        'label': 'Republic of Ireland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'IM',
        'label': 'Isle of Man',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'IL',
        'label': 'Israel',
        'currencyLabel': 'New Israeli Sheqel',
        'currency': 'ILS'
      }, {
        'value': 'IT',
        'label': 'Italy',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'JM',
        'label': 'Jamaica',
        'currencyLabel': 'Jamaican Dollar',
        'currency': 'JMD'
      }, {
        'value': 'JP',
        'label': 'Japan',
        'currencyLabel': 'Yen',
        'currency': 'JPY'
      }, {
        'value': 'JE',
        'label': 'Jersey',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'JO',
        'label': 'Jordan',
        'currencyLabel': 'Jordanian Dinar',
        'currency': 'JOD'
      }, {
        'value': 'KZ',
        'label': 'Kazakhstan',
        'currencyLabel': 'Tenge',
        'currency': 'KZT'
      }, {
        'value': 'KE',
        'label': 'Kenya',
        'currencyLabel': 'Kenyan Shilling',
        'currency': 'KES'
      }, {
        'value': 'KI',
        'label': 'Kiribati',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'KW',
        'label': 'Kuwait',
        'currencyLabel': 'Kuwaiti Dinar',
        'currency': 'KWD'
      }, {
        'value': 'KG',
        'label': 'Kyrgyzstan',
        'currencyLabel': 'Som',
        'currency': 'KGS'
      }, {
        'value': 'LA',
        'label': 'Laos',
        'currencyLabel': 'Kip',
        'currency': 'LAK'
      }, {
        'value': 'LV',
        'label': 'Latvia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LB',
        'label': 'Lebanon',
        'currencyLabel': 'Lebanese Pound',
        'currency': 'LBP'
      }, {
        'value': 'LS',
        'label': 'Lesotho',
        'currencyLabel': 'Loti',
        'currency': 'LSL'
      }, {
        'value': 'LS',
        'label': 'Lesotho',
        'currencyLabel': 'Rand',
        'currency': 'ZAR'
      }, {
        'value': 'LR',
        'label': 'Liberia',
        'currencyLabel': 'Liberian Dollar',
        'currency': 'LRD'
      }, {
        'value': 'LY',
        'label': 'Libya',
        'currencyLabel': 'Libyan Dinar',
        'currency': 'LYD'
      }, {
        'value': 'LI',
        'label': 'Liechtenstein',
        'currencyLabel': 'Swiss Franc',
        'currency': 'CHF'
      }, {
        'value': 'LT',
        'label': 'Lithuania',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LU',
        'label': 'Luxembourg',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MO',
        'label': 'Macau',
        'currencyLabel': 'Pataca',
        'currency': 'MOP'
      }, {
        'value': 'MK',
        'label': 'Republic of Macedonia',
        'currencyLabel': 'Denar',
        'currency': 'MKD'
      }, {
        'value': 'MG',
        'label': 'Madagascar',
        'currencyLabel': 'Malagasy Ariary',
        'currency': 'MGA'
      }, {
        'value': 'MW',
        'label': 'Malawi',
        'currencyLabel': 'Kwacha',
        'currency': 'MWK'
      }, {
        'value': 'MY',
        'label': 'Malaysia',
        'currencyLabel': 'Malaysian Ringgit',
        'currency': 'MYR'
      }, {
        'value': 'MV',
        'label': 'Maldives',
        'currencyLabel': 'Rufiyaa',
        'currency': 'MVR'
      }, {
        'value': 'ML',
        'label': 'Mali',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'MT',
        'label': 'Malta',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MH',
        'label': 'Marshall Islands',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'MQ',
        'label': 'Martinique',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MR',
        'label': 'Mauritania',
        'currencyLabel': 'Ouguiya',
        'currency': 'MRU'
      }, {
        'value': 'MU',
        'label': 'Mauritius',
        'currencyLabel': 'Mauritius Rupee',
        'currency': 'MUR'
      }, {
        'value': 'YT',
        'label': 'Mayotte',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MX',
        'label': 'Mexico',
        'currencyLabel': 'Mexican Peso',
        'currency': 'MXN'
      }, {
        'value': 'FM',
        'label': 'Federated States of Micronesia',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'MD',
        'label': 'Moldova',
        'currencyLabel': 'Moldovan Leu',
        'currency': 'MDL'
      }, {
        'value': 'MC',
        'label': 'Monaco',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MN',
        'label': 'Mongolia',
        'currencyLabel': 'Tugrik',
        'currency': 'MNT'
      }, {
        'value': 'ME',
        'label': 'Montenegro',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MS',
        'label': 'Montserrat',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'MA',
        'label': 'Morocco',
        'currencyLabel': 'Moroccan Dirham',
        'currency': 'MAD'
      }, {
        'value': 'MZ',
        'label': 'Mozambique',
        'currencyLabel': 'Mozambique Metical',
        'currency': 'MZN'
      }, {
        'value': 'MM',
        'label': 'Myanmar',
        'currencyLabel': 'Kyat',
        'currency': 'MMK'
      }, {
        'value': 'NA',
        'label': 'Namibia',
        'currencyLabel': 'Namibia Dollar',
        'currency': 'NAD'
      }, {
        'value': 'NR',
        'label': 'Nauru',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'NP',
        'label': 'Nepal',
        'currencyLabel': 'Nepalese Rupee',
        'currency': 'NPR'
      }, {
        'value': 'NL',
        'label': 'Netherlands',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'NC',
        'label': 'New Caledonia',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'NZ',
        'label': 'New Zealand',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'NI',
        'label': 'Nicaragua',
        'currencyLabel': 'Cordoba Oro',
        'currency': 'NIO'
      }, {
        'value': 'NE',
        'label': 'Niger',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'NG',
        'label': 'Nigeria',
        'currencyLabel': 'Naira',
        'currency': 'NGN'
      }, {
        'value': 'NU',
        'label': 'Niue',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'NF',
        'label': 'Norfolk Island',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'KP',
        'label': 'North Korea',
        'currencyLabel': 'North Korean Won',
        'currency': 'KPW'
      }, {
        'value': 'MP',
        'label': 'Northern Mariana Islands',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'OM',
        'label': 'Oman',
        'currencyLabel': 'Rial Omani',
        'currency': 'OMR'
      }, {
        'value': 'PK',
        'label': 'Pakistan',
        'currencyLabel': 'Pakistan Rupee',
        'currency': 'PKR'
      }, {
        'value': 'PW',
        'label': 'Palau',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'PS',
        'label': 'Palestine',
        'currencyLabel': 'No currency',
        'currency': ''
      }, {
        'value': 'PA',
        'label': 'Panama',
        'currencyLabel': 'Balboa',
        'currency': 'PAB'
      }, {
        'value': 'PG',
        'label': 'Papua New Guinea',
        'currencyLabel': 'Kina',
        'currency': 'PGK'
      }, {
        'value': 'PY',
        'label': 'Paraguay',
        'currencyLabel': 'Guarani',
        'currency': 'PYG'
      }, {
        'value': 'PE',
        'label': 'Peru',
        'currencyLabel': 'Nuevo Sol',
        'currency': 'PEN'
      }, {
        'value': 'PH',
        'label': 'Philippines',
        'currencyLabel': 'Philippine Peso',
        'currency': 'PHP'
      }, {
        'value': 'PN',
        'label': 'Pitcairn Islands',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'PL',
        'label': 'Poland',
        'currencyLabel': 'Zloty',
        'currency': 'PLN'
      }, {
        'value': 'PT',
        'label': 'Portugal',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PR',
        'label': 'Puerto Rico',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'QA',
        'label': 'Qatar',
        'currencyLabel': 'Qatari Rial',
        'currency': 'QAR'
      }, {
        'value': 'XK',
        'label': 'Republic of Kosovo',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'RE',
        'label': 'Réunion',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'RO',
        'label': 'Romania',
        'currencyLabel': 'Romanian Leu',
        'currency': 'RON'
      }, {
        'value': 'RU',
        'label': 'Russia',
        'currencyLabel': 'Russian Ruble',
        'currency': 'RUB'
      }, {
        'value': 'RW',
        'label': 'Rwanda',
        'currencyLabel': 'Rwanda Franc',
        'currency': 'RWF'
      }, {
        'value': 'BL',
        'label': 'Saint Barthélemy',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SH',
        'label': 'Saint Helena',
        'currencyLabel': 'Saint Helena Pound',
        'currency': 'SHP'
      }, {
        'value': 'KN',
        'label': 'Saint Kitts and Nevis',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'LC',
        'label': 'Saint Lucia',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'MF',
        'label': 'Saint Martin',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PM',
        'label': 'Saint Pierre and Miquelon',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'VC',
        'label': 'Saint Vincent and the Grenadines',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'WS',
        'label': 'Samoa',
        'currencyLabel': 'Tala',
        'currency': 'WST'
      }, {
        'value': 'SM',
        'label': 'San Marino',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'ST',
        'label': 'São Tomé and Príncipe',
        'currencyLabel': 'Dobra',
        'currency': 'STN'
      }, {
        'value': 'SA',
        'label': 'Saudi Arabia',
        'currencyLabel': 'Saudi Riyal',
        'currency': 'SAR'
      }, {
        'value': 'SN',
        'label': 'Senegal',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'RS',
        'label': 'Serbia',
        'currencyLabel': 'Serbian Dinar',
        'currency': 'RSD'
      }, {
        'value': 'SC',
        'label': 'Seychelles',
        'currencyLabel': 'Seychelles Rupee',
        'currency': 'SCR'
      }, {
        'value': 'SL',
        'label': 'Sierra Leone',
        'currencyLabel': 'Leone',
        'currency': 'SLL'
      }, {
        'value': 'SG',
        'label': 'Singapore',
        'currencyLabel': 'Singapore Dollar',
        'currency': 'SGD'
      }, {
        'value': 'SX',
        'label': 'Sint Maarten',
        'currencyLabel': 'Netherlands Antillean Guilder',
        'currency': 'ANG'
      }, {
        'value': 'SK',
        'label': 'Slovakia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SI',
        'label': 'Slovenia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SB',
        'label': 'Solomon Islands',
        'currencyLabel': 'Solomon Islands Dollar',
        'currency': 'SBD'
      }, {
        'value': 'SO',
        'label': 'Somalia',
        'currencyLabel': 'Somali Shilling',
        'currency': 'SOS'
      }, {
        'value': 'ZA',
        'label': 'South Africa',
        'currencyLabel': 'Rand',
        'currency': 'ZAR'
      }, {
        'value': 'GS',
        'label': 'South Georgia',
        'currencyLabel': 'No currency',
        'currency': ''
      }, {
        'value': 'KR',
        'label': 'South Korea',
        'currencyLabel': 'Won',
        'currency': 'KRW'
      }, {
        'value': 'SS',
        'label': 'South Sudan',
        'currencyLabel': 'South Sudanese Pound',
        'currency': 'SSP'
      }, {
        'value': 'ES',
        'label': 'Spain',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LK',
        'label': 'Sri Lanka',
        'currencyLabel': 'Sri Lanka Rupee',
        'currency': 'LKR'
      }, {
        'value': 'SD',
        'label': 'Sudan',
        'currencyLabel': 'Sudanese Pound',
        'currency': 'SDG'
      }, {
        'value': 'SR',
        'label': 'Suriname',
        'currencyLabel': 'Surinam Dollar',
        'currency': 'SRD'
      }, {
        'value': 'SJ',
        'label': 'Svalbard and Jan Mayen',
        'currencyLabel': 'Norwegian Krone',
        'currency': 'NOK'
      }, {
        'value': 'SZ',
        'label': 'Swaziland',
        'currencyLabel': 'Lilangeni',
        'currency': 'SZL'
      }, {
        'value': 'CH',
        'label': 'Switzerland',
        'currencyLabel': 'Swiss Franc',
        'currency': 'CHF'
      }, {
        'value': 'CH',
        'label': 'Switzerland',
        'currencyLabel': 'Swiss Franc',
        'currency': 'CHF'
      }, {
        'value': 'CH',
        'label': 'Switzerland',
        'currencyLabel': 'Swiss Franc',
        'currency': 'CHF'
      }, {
        'value': 'SY',
        'label': 'Syria',
        'currencyLabel': 'Syrian Pound',
        'currency': 'SYP'
      }, {
        'value': 'TW',
        'label': 'Taiwan',
        'currencyLabel': 'New Taiwan Dollar',
        'currency': 'TWD'
      }, {
        'value': 'TJ',
        'label': 'Tajikistan',
        'currencyLabel': 'Somoni',
        'currency': 'TJS'
      }, {
        'value': 'TZ',
        'label': 'Tanzania',
        'currencyLabel': 'Tanzanian Shilling',
        'currency': 'TZS'
      }, {
        'value': 'TH',
        'label': 'Thailand',
        'currencyLabel': 'Baht',
        'currency': 'THB'
      }, {
        'value': 'TL',
        'label': 'East Timor',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'TG',
        'label': 'Togo',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'TK',
        'label': 'Tokelau',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'TO',
        'label': 'Tonga',
        'currencyLabel': 'Pa’anga',
        'currency': 'TOP'
      }, {
        'value': 'TT',
        'label': 'Trinidad and Tobago',
        'currencyLabel': 'Trinidad and Tobago Dollar',
        'currency': 'TTD'
      }, {
        'value': 'TN',
        'label': 'Tunisia',
        'currencyLabel': 'Tunisian Dinar',
        'currency': 'TND'
      }, {
        'value': 'TR',
        'label': 'Turkey',
        'currencyLabel': 'Turkish Lira',
        'currency': 'TRY'
      }, {
        'value': 'TM',
        'label': 'Turkmenistan',
        'currencyLabel': 'Turkmenistan New Manat',
        'currency': 'TMT'
      }, {
        'value': 'TC',
        'label': 'Turks and Caicos Islands',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'TV',
        'label': 'Tuvalu',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'UG',
        'label': 'Uganda',
        'currencyLabel': 'Uganda Shilling',
        'currency': 'UGX'
      }, {
        'value': 'UA',
        'label': 'Ukraine',
        'currencyLabel': 'Hryvnia',
        'currency': 'UAH'
      }, {
        'value': 'AE',
        'label': 'United Arab Emirates',
        'currencyLabel': 'UAE Dirham',
        'currency': 'AED'
      }, {
        'value': 'GB',
        'label': 'United Kingdom',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'US',
        'label': 'United States',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'UY',
        'label': 'Uruguay',
        'currencyLabel': 'Peso Uruguayo',
        'currency': 'UYU'
      }, {
        'value': 'UZ',
        'label': 'Uzbekistan',
        'currencyLabel': 'Uzbekistan Sum',
        'currency': 'UZS'
      }, {
        'value': 'VU',
        'label': 'Vanuatu',
        'currencyLabel': 'Vatu',
        'currency': 'VUV'
      }, {
        'value': 'VE',
        'label': 'Venezuela',
        'currencyLabel': 'Bolivar',
        'currency': 'VEF'
      }, {
        'value': 'VN',
        'label': 'Vietnam',
        'currencyLabel': 'Dong',
        'currency': 'VND'
      }, {
        'value': 'WF',
        'label': 'Wallis and Futuna',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'EH',
        'label': 'Western Sahara',
        'currencyLabel': 'Moroccan Dirham',
        'currency': 'MAD'
      }, {
        'value': 'YE',
        'label': 'Yemen',
        'currencyLabel': 'Yemeni Rial',
        'currency': 'YER'
      }, {
        'value': 'ZM',
        'label': 'Zambia',
        'currencyLabel': 'Zambian Kwacha',
        'currency': 'ZMW'
      }, {
        'value': 'ZW',
        'label': 'Zimbabwe',
        'currencyLabel': 'Zimbabwe Dollar',
        'currency': 'ZWL'
      }, {
        'value': 'XX',
        'value3': 'XXX',
        'label': 'Demoland',
        'currencyLabel': 'Demokroner',
        'currency': 'XXX'
      }
    ],
    'nb': [
      {
        'value': 'NO',
        'value3': 'NOK',
        'label': 'Norge',
        'currencyLabel': 'Norsk Krone',
        'currency': 'NOK'
      }, {
        'value': 'SE',
        'value3': 'SWE',
        'label': 'Sverige',
        'currencyLabel': 'Svensk Krona',
        'currency': 'SEK'
      }, {
        'value': 'DK',
        'value3': 'DNK',
        'label': 'Danmark',
        'currencyLabel': 'Dansk Krone',
        'currency': 'DKK'
      }, {
        'value': 'AF',
        'value3': 'AFG',
        'label': 'Afghanistan',
        'currency': 'AFN',
        'currencyLabel': 'Afghani'
      }, {
        'value': 'AX',
        'label': 'Åland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'AL',
        'value3': 'ALB',
        'label': 'Albania',
        'currency': 'ALL',
        'currencyLabel': 'Albansk Lek'
      }, {
        'value': 'DZ',
        'value3': 'DZA',
        'label': 'Algerie',
        'currency': 'DZD',
        'currencyLabel': 'Algerian Dinar'
      }, {
        'value': 'AS',
        'value3': 'ASM',
        'label': 'Amerikansk Samoa',
        'currency': 'USD',
        'currencyLabel': 'USA Dollar'
      }, {
        'value': 'AD',
        'value3': 'AND',
        'label': 'Andorra',
        'currency': 'EUR',
        'currencyLabel': 'Euro'
      }, {
        'value': 'AO',
        'value3': 'AGO',
        'label': 'Angola',
        'currencyLabel': 'Kwanza',
        'currency': 'AOA'
      }, {
        'value': 'AI',
        'value3': 'AIA',
        'label': 'Anguilla',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'AQ',
        'value3': 'ATA',
        'label': 'Antarctica',
        'currencyLabel': 'Ingen valuta',
        'currency': ''
      }, {
        'value': 'AG',
        'value3': 'ATG',
        'label': 'Antigua og Barbuda',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'AR',
        'value3': 'ARG',
        'label': 'Argentina',
        'currencyLabel': 'Argentine Peso',
        'currency': 'ARS'
      }, {
        'value': 'AM',
        'value3': 'ARM',
        'label': 'Armenia',
        'currencyLabel': 'Armenian Dram',
        'currency': 'AMD'
      }, {
        'value': 'AW',
        'value3': 'ABW',
        'label': 'Aruba',
        'currencyLabel': 'Aruban Florin',
        'currency': 'AWG'
      }, {
        'value': 'AZ',
        'value3': 'AZE',
        'label': 'Aserbajdsjan',
        'currencyLabel': 'Azerbaijanian Manat',
        'currency': 'AZN'
      }, {
        'value': 'AU',
        'value3': 'AUS',
        'label': 'Australia',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'BS',
        'value3': 'BHS',
        'label': 'Bahamas',
        'currencyLabel': 'Bahamian Dollar',
        'currency': 'BSD'
      }, {
        'value': 'BH',
        'value3': 'BHR',
        'label': 'Bahrain',
        'currencyLabel': 'Bahraini Dinar',
        'currency': 'BHD'
      }, {
        'value': 'BD',
        'value3': 'BGD',
        'label': 'Bangladesh',
        'currencyLabel': 'Taka',
        'currency': 'BDT'
      }, {
        'value': 'BB',
        'value3': 'BRB',
        'label': 'Barbados',
        'currencyLabel': 'Barbados Dollar',
        'currency': 'BBD'
      }, {
        'value': 'BE',
        'value3': 'BEL',
        'label': 'Belgia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'BZ',
        'value3': 'BLZ',
        'label': 'Belize',
        'currencyLabel': 'Belize Dollar',
        'currency': 'BZD'
      }, {
        'value': 'BJ',
        'value3': 'BEN',
        'label': 'Benin',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'BM',
        'value3': 'BMU',
        'label': 'Bermuda',
        'currencyLabel': 'Bermudian Dollar',
        'currency': 'BMD'
      }, {
        'value': 'BT',
        'value3': 'BTN',
        'label': 'Bhutan',
        'currencyLabel': 'Ngultrum',
        'currency': 'BTN'
      }, {
        'value': 'BT',
        'value3': 'BTN',
        'label': 'Bhutan',
        'currencyLabel': 'Indian Rupee',
        'currency': 'INR'
      }, {
        'value': 'BO',
        'value3': 'BOL',
        'label': 'Bolivia',
        'currencyLabel': 'Boliviano',
        'currency': 'BOB'
      }, {
        'value': 'BO',
        'value3': 'BOL',
        'label': 'Bolivia',
        'currencyLabel': 'Mvdol',
        'currency': 'BOV'
      }, {
        'value': 'BQ',
        'value3': 'BES',
        'label': 'Bonaire',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'BA',
        'value3': 'BIH',
        'label': 'Bosnia Hercegovina',
        'currencyLabel': 'Convertible Mark',
        'currency': 'BAM'
      }, {
        'value': 'BW',
        'value3': 'BWA',
        'label': 'Botswana',
        'currencyLabel': 'Pula',
        'currency': 'BWP'
      }, {
        'value': 'BV',
        'label': 'Bouvetøya',
        'currencyLabel': 'Norwegian Krone',
        'currency': 'NOK'
      }, {
        'value': 'BR',
        'value3': 'BRA',
        'label': 'Brasil',
        'currencyLabel': 'Brazilian Real',
        'currency': 'BRL'
      }, {
        'value': 'BN',
        'value3': 'BRN',
        'label': 'Brunei',
        'currencyLabel': 'Brunei Dollar',
        'currency': 'BND'
      }, {
        'value': 'BG',
        'value3': 'BGR',
        'label': 'Bulgaria',
        'currencyLabel': 'Bulgarian Lev',
        'currency': 'BGN'
      }, {
        'value': 'BF',
        'value3': 'BFA',
        'label': 'Burkina Faso',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'BI',
        'value3': 'BDI',
        'label': 'Burundi',
        'currencyLabel': 'Burundi Franc',
        'currency': 'BIF'
      }, {
        'value': 'CA',
        'value3': 'CAN',
        'label': 'Canada',
        'currencyLabel': 'Canadian Dollar',
        'currency': 'CAD'
      }, {
        'value': 'KY',
        'value3': 'CYM',
        'label': 'Caymanøyene',
        'currencyLabel': 'Cayman Islands Dollar',
        'currency': 'KYD'
      }, {
        'value': 'CL',
        'value3': 'CHL',
        'label': 'Chile',
        'currencyLabel': 'Chilean Peso',
        'currency': 'CLP'
      }, {
        'value': 'CX',
        'value3': 'CXR',
        'label': 'Christmasøya',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'CO',
        'value3': 'COL',
        'label': 'Colombia',
        'currencyLabel': 'Colombian Peso',
        'currency': 'COP'
      }, {
        'value': 'IO',
        'value3': 'IOT',
        'label': 'Det Britisk Territoriet i Indiahavet',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'VG',
        'value3': 'VGB',
        'label': 'De Britiske Jomfruøyene',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'CD',
        'value3': 'COD',
        'label': 'Den Demokratiske Republikk Kongo',
        'currencyLabel': 'Congolese Franc',
        'currency': 'CDF'
      }, {
        'value': 'DO',
        'value3': 'DOM',
        'label': 'Den Dominikanske Republikk',
        'currencyLabel': 'Dominican Peso',
        'currency': 'DOP'
      }, {
        'value': 'AE',
        'value3': 'ARE',
        'label': 'De Forente Arabiske Emirater',
        'currencyLabel': 'UAE Dirham',
        'currency': 'AED'
      }, {
        'value': 'TF',
        'value3': 'ATF',
        'label': 'Den Franske Sørterritoria',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'VA',
        'value3': 'VAT',
        'label': 'Den Hellige Stol',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'CF',
        'value3': 'CAF',
        'label': 'Den Sentralafrikanske Republikk',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'CK',
        'value3': 'COK',
        'label': 'Cookøyene',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'CR',
        'value3': 'CRI',
        'label': 'Costa Rica',
        'currencyLabel': 'Costa Rican Colon',
        'currency': 'CRC'
      }, {
        'value': 'CU',
        'value3': 'CUB',
        'label': 'Cuba',
        'currencyLabel': 'Cuban Peso',
        'currency': 'CUP'
      }, {
        'value': 'CW',
        'value3': 'CUW',
        'label': 'Curaçao',
        'currencyLabel': 'Netherlands Antillean Guilder',
        'currency': 'ANG'
      }, {
        'value': 'DJ',
        'value3': 'DJI',
        'label': 'Djibouti',
        'currencyLabel': 'Djibouti Franc',
        'currency': 'DJF'
      }, {
        'value': 'DM',
        'value3': 'DMA',
        'label': 'Dominica',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'EC',
        'value3': 'ECU',
        'label': 'Ecuador',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'EG',
        'value3': 'EGY',
        'label': 'Egypt',
        'currencyLabel': 'Egyptian Pound',
        'currency': 'EGP'
      }, {
        'value': 'SV',
        'value3': 'SLV',
        'label': 'El Salvador',
        'currencyLabel': 'El Salvador Colon',
        'currency': 'SVC'
      }, {
        'value': 'CI',
        'value3': 'CIV',
        'label': 'Elfenbenskysten',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'GQ',
        'value3': 'GNQ',
        'label': 'Ekvatorial Guinea',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'ER',
        'value3': 'ERI',
        'label': 'Eritrea',
        'currencyLabel': 'Nakfa',
        'currency': 'ERN'
      }, {
        'value': 'EE',
        'value3': 'EST',
        'label': 'Estland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'ET',
        'value3': 'ETH',
        'label': 'Etiopia',
        'currencyLabel': 'Ethiopian Birr',
        'currency': 'ETB'
      }, {
        'value': 'FK',
        'value3': 'FLK',
        'label': 'Falklandøyene',
        'currencyLabel': 'Falkland Islands Pound',
        'currency': 'FKP'
      }, {
        'value': 'FO',
        'value3': 'FRO',
        'label': 'Færøyene',
        'currencyLabel': 'Dansk Krone',
        'currency': 'DKK'
      }, {
        'value': 'FJ',
        'value3': 'FJI',
        'label': 'Fiji',
        'currencyLabel': 'Fiji Dollar',
        'currency': 'FJD'
      }, {
        'value': 'PH',
        'value3': 'PHL',
        'label': 'Filippinene',
        'currencyLabel': 'Philippine Peso',
        'currency': 'PHP'
      }, {
        'value': 'FI',
        'value3': 'FIN',
        'label': 'Finland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'FR',
        'value3': 'FRA',
        'label': 'Frankrike',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GF',
        'value3': 'GUF',
        'label': 'Fransk Guiana',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PF',
        'value3': 'PYF',
        'label': 'Fransk Polynesia',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'GA',
        'value3': 'GAB',
        'label': 'Gabon',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'GM',
        'value3': 'GMB',
        'label': 'Gambia',
        'currencyLabel': 'Dalasi',
        'currency': 'GMD'
      }, {
        'value': 'GE',
        'value3': 'GEO',
        'label': 'Georgia',
        'currencyLabel': 'Lari',
        'currency': 'GEL'
      }, {
        'value': 'GH',
        'value3': 'GHA',
        'label': 'Ghana',
        'currencyLabel': 'Ghana Cedi',
        'currency': 'GHS'
      }, {
        'value': 'GI',
        'value3': 'GIB',
        'label': 'Gibraltar',
        'currencyLabel': 'Gibraltar Pound',
        'currency': 'GIP'
      }, {
        'value': 'GL',
        'value3': 'GRL',
        'label': 'Grønland',
        'currencyLabel': 'Dansk Krone',
        'currency': 'DKK'
      }, {
        'value': 'GD',
        'value3': 'GRD',
        'label': 'Grenada',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'GP',
        'value3': 'GLP',
        'label': 'Guadeloupe',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'GU',
        'value3': 'GUM',
        'label': 'Guam',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'GT',
        'value3': 'GTM',
        'label': 'Guatemala',
        'currencyLabel': 'Quetzal',
        'currency': 'GTQ'
      }, {
        'value': 'GG',
        'value3': 'GGY',
        'label': 'Guernsey',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'GW',
        'value3': 'GNB',
        'label': 'Guinea-Bissau',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'GY',
        'value3': 'GUY',
        'label': 'Guyana',
        'currencyLabel': 'Guyana Dollar',
        'currency': 'GYD'
      }, {
        'value': 'HT',
        'value3': 'HTI',
        'label': 'Haiti',
        'currencyLabel': 'Gourde',
        'currency': 'HTG'
      }, {
        'value': 'HM',
        'value3': 'HMD',
        'label': 'Heardøya og McDonaldøyene',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'GR',
        'value3': 'GRC',
        'label': 'Hellas',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'HN',
        'value3': 'HND',
        'label': 'Honduras',
        'currencyLabel': 'Lempira',
        'currency': 'HNL'
      }, {
        'value': 'HK',
        'value3': 'HKG',
        'label': 'Hong Kong',
        'currencyLabel': 'Hong Kong Dollar',
        'currency': 'HKD'
      }, {
        'value': 'BY',
        'value3': 'BLR',
        'label': 'Hviterussland',
        'currencyLabel': 'Belarussian Ruble',
        'currency': 'BYR'
      }, {
        'value': 'IN',
        'value3': 'IND',
        'label': 'India',
        'currencyLabel': 'Indian Rupee',
        'currency': 'INR'
      }, {
        'value': 'ID',
        'value3': 'IDN',
        'label': 'Indonesia',
        'currencyLabel': 'Rupiah',
        'currency': 'IDR'
      }, {
        'value': 'IS',
        'value3': 'ISL',
        'label': 'Island',
        'currencyLabel': 'Iceland Krona',
        'currency': 'ISK'
      }, {
        'value': 'IQ',
        'value3': 'IRQ',
        'label': 'Irak',
        'currencyLabel': 'Iraqi Dinar',
        'currency': 'IQD'
      }, {
        'value': 'IR',
        'value3': 'IRN',
        'label': 'Iran',
        'currencyLabel': 'Iranian Rial',
        'currency': 'IRR'
      }, {
        'value': 'IE',
        'value3': 'IRL',
        'label': 'Irland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'IL',
        'value3': 'ISR',
        'label': 'Israel',
        'currencyLabel': 'New Israeli Sheqel',
        'currency': 'ILS'
      }, {
        'value': 'IT',
        'value3': 'ITA',
        'label': 'Italia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'JM',
        'value3': 'JAM',
        'label': 'Jamaica',
        'currencyLabel': 'Jamaican Dollar',
        'currency': 'JMD'
      }, {
        'value': 'JP',
        'value3': 'JPN',
        'label': 'Japan',
        'currencyLabel': 'Yen',
        'currency': 'JPY'
      }, {
        'value': 'YE',
        'value3': 'YEM',
        'label': 'Jemen',
        'currencyLabel': 'Yemeni Rial',
        'currency': 'YER'
      }, {
        'value': 'JE',
        'value3': 'JEY',
        'label': 'Jersey',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'VI',
        'value3': 'VIR',
        'label': 'Jomfruøyene (U.S.)',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'JO',
        'value3': 'JOR',
        'label': 'Jordan',
        'currencyLabel': 'Jordanian Dinar',
        'currency': 'JOD'
      }, {
        'value': 'KZ',
        'value3': 'KAZ',
        'label': 'Kazakhstan',
        'currencyLabel': 'Tenge',
        'currency': 'KZT'
      }, {
        'value': 'KH',
        'value3': 'KHM',
        'label': 'Kambodsja',
        'currencyLabel': 'Riel',
        'currency': 'KHR'
      }, {
        'value': 'CM',
        'value3': 'CMR',
        'label': 'Kamerun',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'CV',
        'value3': 'CPV',
        'label': 'Kapp Verde',
        'currencyLabel': 'Cabo Verde Escudo',
        'currency': 'CVE'
      }, {
        'value': 'KE',
        'value3': 'KEN',
        'label': 'Kenya',
        'currencyLabel': 'Kenyan Shilling',
        'currency': 'KES'
      }, {
        'value': 'CN',
        'value3': 'CHN',
        'label': 'Kina',
        'currencyLabel': 'Yuan Renminbi',
        'currency': 'CNY'
      }, {
        'value': 'KG',
        'value3': 'KGZ',
        'label': 'Kirgisistan',
        'currencyLabel': 'Som',
        'currency': 'KGS'
      }, {
        'value': 'KI',
        'value3': 'KIR',
        'label': 'Kiribati',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'KM',
        'value3': 'COM',
        'label': 'Komorene',
        'currencyLabel': 'Comoro Franc',
        'currency': 'KMF'
      }, {
        'value': 'CG',
        'value3': 'COG',
        'label': 'Kongo',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'XK',
        'value3': 'XKX',
        'label': 'Kosovo',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'HR',
        'value3': 'HRV',
        'label': 'Kroatia',
        'currencyLabel': 'Kuna',
        'currency': 'HRK'
      }, {
        'value': 'CY',
        'value3': 'CYP',
        'label': 'Kypros',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'KW',
        'value3': 'KWT',
        'label': 'Kuwait',
        'currencyLabel': 'Kuwaiti Dinar',
        'currency': 'KWD'
      }, {
        'value': 'LA',
        'value3': 'LAO',
        'label': 'Laos',
        'currencyLabel': 'Kip',
        'currency': 'LAK'
      }, {
        'value': 'LV',
        'value3': 'LVA',
        'label': 'Latvia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LS',
        'value3': 'LSO',
        'label': 'Lesotho',
        'currencyLabel': 'Loti',
        'currency': 'LSL'
      }, {
        'value': 'LS',
        'value3': 'LSO',
        'label': 'Lesotho',
        'currencyLabel': 'Rand',
        'currency': 'ZAR'
      }, {
        'value': 'LB',
        'value3': 'LBN',
        'label': 'Libanon',
        'currencyLabel': 'Lebanese Pound',
        'currency': 'LBP'
      }, {
        'value': 'LR',
        'value3': 'LBR',
        'label': 'Liberia',
        'currencyLabel': 'Liberian Dollar',
        'currency': 'LRD'
      }, {
        'value': 'LY',
        'value3': 'LBY',
        'label': 'Libya',
        'currencyLabel': 'Libyan Dinar',
        'currency': 'LYD'
      }, {
        'value': 'LI',
        'value3': 'LIE',
        'label': 'Liechtenstein',
        'currencyLabel': 'Swiss Franc',
        'currency': 'CHF'
      }, {
        'value': 'LT',
        'value3': 'LTU',
        'label': 'Litauen',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LU',
        'value3': 'LUX',
        'label': 'Luxembourg',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MO',
        'value3': 'MAC',
        'label': 'Macau',
        'currencyLabel': 'Pataca',
        'currency': 'MOP'
      }, {
        'value': 'MK',
        'value3': 'MKD',
        'label': 'Makedonien',
        'currencyLabel': 'Denar',
        'currency': 'MKD'
      }, {
        'value': 'MG',
        'value3': 'MDG',
        'label': 'Madagaskar',
        'currencyLabel': 'Malagasy Ariary',
        'currency': 'MGA'
      }, {
        'value': 'MW',
        'value3': 'MWI',
        'label': 'Malawi',
        'currencyLabel': 'Kwacha',
        'currency': 'MWK'
      }, {
        'value': 'MY',
        'value3': 'MYS',
        'label': 'Malaysia',
        'currencyLabel': 'Malaysian Ringgit',
        'currency': 'MYR'
      }, {
        'value': 'MV',
        'value3': 'MDV',
        'label': 'Maldivene',
        'currencyLabel': 'Rufiyaa',
        'currency': 'MVR'
      }, {
        'value': 'ML',
        'value3': 'MLI',
        'label': 'Mali',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'MT',
        'value3': 'MLT',
        'label': 'Malta',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'IM',
        'value3': 'IMN',
        'label': 'Man',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'MH',
        'value3': 'MHL',
        'label': 'Marshalløyene',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'MQ',
        'value3': 'MTQ',
        'label': 'Martinique',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MR',
        'value3': 'MRT',
        'label': 'Mauritania',
        'currencyLabel': 'Ouguiya',
        'currency': 'MRU'
      }, {
        'value': 'MU',
        'value3': 'MUS',
        'label': 'Mauritius',
        'currencyLabel': 'Mauritius Rupee',
        'currency': 'MUR'
      }, {
        'value': 'YT',
        'value3': 'MYT',
        'label': 'Mayotte',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MX',
        'value3': 'MEX',
        'label': 'Mexico',
        'currencyLabel': 'Mexican Peso',
        'currency': 'MXN'
      }, {
        'value': 'FM',
        'value3': 'FSM',
        'label': 'Mikronesia',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'MD',
        'value3': 'MDS',
        'label': 'Moldova',
        'currencyLabel': 'Moldovan Leu',
        'currency': 'MDL'
      }, {
        'value': 'MC',
        'value3': 'MCO',
        'label': 'Monaco',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MN',
        'value3': 'MNG',
        'label': 'Mongolia',
        'currencyLabel': 'Tugrik',
        'currency': 'MNT'
      }, {
        'value': 'ME',
        'value3': 'MNE',
        'label': 'Montenegro',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'MS',
        'value3': 'MSR',
        'label': 'Montserrat',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'MA',
        'value3': 'MAR',
        'label': 'Morokko',
        'currencyLabel': 'Moroccan Dirham',
        'currency': 'MAD'
      }, {
        'value': 'MZ',
        'value3': 'MOZ',
        'label': 'Mosambik',
        'currencyLabel': 'Mozambique Metical',
        'currency': 'MZN'
      }, {
        'value': 'MM',
        'value3': 'MMR',
        'label': 'Myanmar',
        'currencyLabel': 'Kyat',
        'currency': 'MMK'
      }, {
        'value': 'NA',
        'value3': 'NAM',
        'label': 'Namibia',
        'currencyLabel': 'Namibia Dollar',
        'currency': 'NAD'
      }, {
        'value': 'NR',
        'value3': 'NRU',
        'label': 'Nauru',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'NL',
        'value3': 'NLD',
        'label': 'Nederland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'NP',
        'value3': 'NPL',
        'label': 'Nepal',
        'currencyLabel': 'Nepalese Rupee',
        'currency': 'NPR'
      }, {
        'value': 'NZ',
        'value3': 'NZL',
        'label': 'New Zealand',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'NI',
        'value3': 'NIC',
        'label': 'Nicaragua',
        'currencyLabel': 'Cordoba Oro',
        'currency': 'NIO'
      }, {
        'value': 'NE',
        'value3': 'NER',
        'label': 'Niger',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'NG',
        'value3': 'NGA',
        'label': 'Nigeria',
        'currencyLabel': 'Naira',
        'currency': 'NGN'
      }, {
        'value': 'NU',
        'value3': 'NIU',
        'label': 'Niue',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'NF',
        'value3': 'NFK',
        'label': 'Norfolkøya',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'KP',
        'value3': 'PRK',
        'label': 'Nord-Korea',
        'currencyLabel': 'North Korean Won',
        'currency': 'KPW'
      }, {
        'value': 'MP',
        'value3': 'MNP',
        'label': 'Nord-Marianene',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'NC',
        'value3': 'NCL',
        'label': 'Ny-Caledonia',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'OM',
        'value3': 'OMN',
        'label': 'Oman',
        'currencyLabel': 'Rial Omani',
        'currency': 'OMR'
      }, {
        'value': 'PK',
        'value3': 'PAK',
        'label': 'Pakistan',
        'currencyLabel': 'Pakistan Rupee',
        'currency': 'PKR'
      }, {
        'value': 'PW',
        'value3': 'PLW',
        'label': 'Palau',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'PS',
        'value3': 'PSE',
        'label': 'Palestine',
        'currencyLabel': 'Ingen valuta',
        'currency': ''
      }, {
        'value': 'PA',
        'value3': 'PAN',
        'label': 'Panama',
        'currencyLabel': 'Balboa',
        'currency': 'PAB'
      }, {
        'value': 'PG',
        'value3': 'PNG',
        'label': 'Papua Ny-Guinea',
        'currencyLabel': 'Kina',
        'currency': 'PGK'
      }, {
        'value': 'PY',
        'value3': 'PRY',
        'label': 'Paraguay',
        'currencyLabel': 'Guarani',
        'currency': 'PYG'
      }, {
        'value': 'PE',
        'value3': 'PER',
        'label': 'Peru',
        'currencyLabel': 'Nuevo Sol',
        'currency': 'PEN'
      }, {
        'value': 'PN',
        'value3': 'PCN',
        'label': 'Pitcairnøyene',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'PL',
        'value3': 'POL',
        'label': 'Polen',
        'currencyLabel': 'Zloty',
        'currency': 'PLN'
      }, {
        'value': 'PT',
        'value3': 'PRT',
        'label': 'Portugal',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PR',
        'value3': 'PRI',
        'label': 'Puerto Rico',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'QA',
        'value3': 'QAT',
        'label': 'Qatar',
        'currencyLabel': 'Qatari Rial',
        'currency': 'QAR'
      }, {
        'value': 'RE',
        'value3': 'REU',
        'label': 'Réunion',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'RO',
        'value3': 'ROU',
        'label': 'Romania',
        'currencyLabel': 'Romanian Leu',
        'currency': 'RON'
      }, {
        'value': 'RU',
        'value3': 'RUS',
        'label': 'Russland',
        'currencyLabel': 'Russian Ruble',
        'currency': 'RUB'
      }, {
        'value': 'RW',
        'value3': 'RWA',
        'label': 'Rwanda',
        'currencyLabel': 'Rwanda Franc',
        'currency': 'RWF'
      }, {
        'value': 'BL',
        'value3': 'BLM',
        'label': 'Saint Barthélemy',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SH',
        'value3': 'SHN',
        'label': 'Saint Helena',
        'currencyLabel': 'Saint Helena Pound',
        'currency': 'SHP'
      }, {
        'value': 'KN',
        'value3': 'KNA',
        'label': 'Saint Kitts og Nevis',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'LC',
        'value3': 'LCA',
        'label': 'Saint Lucia',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'MF',
        'value3': 'MAF',
        'label': 'Saint Martin',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'PM',
        'value3': 'SPM',
        'label': 'Saint Pierre og Miquelon',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'VC',
        'value3': 'VCT',
        'label': 'Saint Vincent og Grenadinene',
        'currencyLabel': 'East Caribbean Dollar',
        'currency': 'XCD'
      }, {
        'value': 'SB',
        'value3': 'SLB',
        'label': 'Salomonøyene',
        'currencyLabel': 'Solomon Islands Dollar',
        'currency': 'SBD'
      }, {
        'value': 'WS',
        'value3': 'WSM',
        'label': 'Samoa',
        'currencyLabel': 'Tala',
        'currency': 'WST'
      }, {
        'value': 'SM',
        'value3': 'SMR',
        'label': 'San Marino',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'ST',
        'value3': 'STP',
        'label': 'São Tomé og Príncipe',
        'currencyLabel': 'Dobra',
        'currency': 'STN'
      }, {
        'value': 'SA',
        'value3': 'SAU',
        'label': 'Saudi Arabia',
        'currencyLabel': 'Saudi Riyal',
        'currency': 'SAR'
      }, {
        'value': 'SN',
        'value3': 'SEN',
        'label': 'Senegal',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'RS',
        'value3': 'SRB',
        'label': 'Serbia',
        'currencyLabel': 'Serbian Dinar',
        'currency': 'RSD'
      }, {
        'value': 'SC',
        'value3': 'SYC',
        'label': 'Seychellene',
        'currencyLabel': 'Seychelles Rupee',
        'currency': 'SCR'
      }, {
        'value': 'SL',
        'value3': 'SLE',
        'label': 'Sierra Leone',
        'currencyLabel': 'Leone',
        'currency': 'SLL'
      }, {
        'value': 'SG',
        'value3': 'SGP',
        'label': 'Singapore',
        'currencyLabel': 'Singapore Dollar',
        'currency': 'SGD'
      }, {
        'value': 'SX',
        'value3': 'SXM',
        'label': 'Sint Maarten',
        'currencyLabel': 'Netherlands Antillean Guilder',
        'currency': 'ANG'
      }, {
        'value': 'SK',
        'value3': 'SVK',
        'label': 'Slovakia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SI',
        'value3': 'SVN',
        'label': 'Slovenia',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'SO',
        'value3': 'SOM',
        'label': 'Somalia',
        'currencyLabel': 'Somali Shilling',
        'currency': 'SOS'
      }, {
        'value': 'ZA',
        'value3': 'ZAF',
        'label': 'Sør-Africa',
        'currencyLabel': 'Rand',
        'currency': 'ZAR'
      }, {
        'value': 'GS',
        'value3': 'SGS',
        'label': 'Sør-Georgia',
        'currencyLabel': 'South Sudanese Pound',
        'currency': 'SSP'
      }, {
        'value': 'KR',
        'value3': 'KOR',
        'label': 'Sør-Korea',
        'currencyLabel': 'Won',
        'currency': 'KRW'
      }, {
        'value': 'SS',
        'value3': 'SSD',
        'label': 'Sør-Sudan',
        'currencyLabel': 'South Sudanese Pound',
        'currency': 'SSP'
      }, {
        'value': 'ES',
        'value3': 'ESP',
        'label': 'Spania',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'LK',
        'value3': 'LKA',
        'label': 'Sri Lanka',
        'currencyLabel': 'Sri Lanka Rupee',
        'currency': 'LKR'
      }, {
        'value': 'GB',
        'value3': 'GBR',
        'label': 'Storbritannia',
        'currencyLabel': 'Pound Sterling',
        'currency': 'GBP'
      }, {
        'value': 'SD',
        'value3': 'SDN',
        'label': 'Sudan',
        'currencyLabel': 'Sudanese Pound',
        'currency': 'SDG'
      }, {
        'value': 'SR',
        'value3': 'SUR',
        'label': 'Surinam',
        'currencyLabel': 'Surinam Dollar',
        'currency': 'SRD'
      }, {
        'value': 'SJ',
        'value3': 'SJM',
        'label': 'Svalbard og Jan Mayen',
        'currencyLabel': 'Norsk Krone',
        'currency': 'NOK'
      }, {
        'value': 'SZ',
        'value3': 'SWZ',
        'label': 'Swaziland',
        'currencyLabel': 'Lilangeni',
        'currency': 'SZL'
      }, {
        'value': 'CH',
        'value3': 'CHE',
        'label': 'Sveits',
        'currencyLabel': 'WIR Euro',
        'currency': 'CHE'
      }, {
        'value': 'SY',
        'value3': 'SYR',
        'label': 'Syria',
        'currencyLabel': 'Syrian Pound',
        'currency': 'SYP'
      }, {
        'value': 'TW',
        'value3': 'TWN',
        'label': 'Taiwan',
        'currencyLabel': 'New Taiwan Dollar',
        'currency': 'TWD'
      }, {
        'value': 'TJ',
        'value3': 'TJK',
        'label': 'Tadsjikistan',
        'currencyLabel': 'Somoni',
        'currency': 'TJS'
      }, {
        'value': 'TZ',
        'value3': 'TZA',
        'label': 'Tanzania',
        'currencyLabel': 'Tanzanian Shilling',
        'currency': 'TZS'
      }, {
        'value': 'TH',
        'value3': 'THA',
        'label': 'Thailand',
        'currencyLabel': 'Baht',
        'currency': 'THB'
      }, {
        'value': 'CZ',
        'value3': 'CZE',
        'label': 'Tsjekkia',
        'currencyLabel': 'Czech Koruna',
        'currency': 'CZK'
      }, {
        'value': 'TG',
        'value3': 'TGO',
        'label': 'Togo',
        'currencyLabel': 'CFA Franc BCEAO',
        'currency': 'XOF'
      }, {
        'value': 'TK',
        'value3': 'TKL',
        'label': 'Tokelau',
        'currencyLabel': 'New Zealand Dollar',
        'currency': 'NZD'
      }, {
        'value': 'TO',
        'value3': 'TON',
        'label': 'Tonga',
        'currencyLabel': 'Pa’anga',
        'currency': 'TOP'
      }, {
        'value': 'TT',
        'value3': 'TTO',
        'label': 'Trinidad og Tobago',
        'currencyLabel': 'Trinidad and Tobago Dollar',
        'currency': 'TTD'
      }, {
        'value': 'TD',
        'value3': 'TCD',
        'label': 'Tsjad',
        'currencyLabel': 'CFA Franc BEAC',
        'currency': 'XAF'
      }, {
        'value': 'TN',
        'value3': 'TUN',
        'label': 'Tunisia',
        'currencyLabel': 'Tunisian Dinar',
        'currency': 'TND'
      }, {
        'value': 'TR',
        'value3': 'TUR',
        'label': 'Tyrkia',
        'currencyLabel': 'Turkish Lira',
        'currency': 'TRY'
      }, {
        'value': 'TM',
        'value3': 'TKM',
        'label': 'Turkmenistan',
        'currencyLabel': 'Turkmenistan New Manat',
        'currency': 'TMT'
      }, {
        'value': 'TC',
        'value3': 'TCA',
        'label': 'Turks- og Caicosøyene',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'TV',
        'value3': 'TUV',
        'label': 'Tuvalu',
        'currencyLabel': 'Australian Dollar',
        'currency': 'AUD'
      }, {
        'value': 'DE',
        'value3': 'DEU',
        'label': 'Tyskland',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'UG',
        'value3': 'UGA',
        'label': 'Uganda',
        'currencyLabel': 'Uganda Shilling',
        'currency': 'UGX'
      }, {
        'value': 'UA',
        'value3': 'UKR',
        'label': 'Ukraina',
        'currencyLabel': 'Hryvnia',
        'currency': 'UAH'
      }, {
        'value': 'HU',
        'value3': 'HUN',
        'label': 'Ungarn',
        'currencyLabel': 'Forint',
        'currency': 'HUF'
      }, {
        'value': 'US',
        'value3': 'USA',
        'label': 'USA (Amerikas Forente Stater)',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'UY',
        'value3': 'URY',
        'label': 'Uruguay',
        'currencyLabel': 'Peso Uruguayo',
        'currency': 'UYU'
      }, {
        'value': 'UZ',
        'value3': 'UZB',
        'label': 'Usbekistan',
        'currencyLabel': 'Uzbekistan Sum',
        'currency': 'UZS'
      }, {
        'value': 'VU',
        'value3': 'VUT',
        'label': 'Vanuatu',
        'currencyLabel': 'Vatu',
        'currency': 'VUV'
      }, {
        'value': 'VE',
        'value3': 'VEN',
        'label': 'Venezuela',
        'currencyLabel': 'Bolivar',
        'currency': 'VEF'
      }, {
        'value': 'EH',
        'value3': 'ESH',
        'label': 'Vest-Sahara',
        'currencyLabel': 'Moroccan Dirham',
        'currency': 'MAD'
      }, {
        'value': 'VN',
        'value3': 'VNM',
        'label': 'Vietnam',
        'currencyLabel': 'Dong',
        'currency': 'VND'
      }, {
        'value': 'WF',
        'value3': 'WLF',
        'label': 'Wallis og Futuna',
        'currencyLabel': 'CFP Franc',
        'currency': 'XPF'
      }, {
        'value': 'ZM',
        'value3': 'ZMB',
        'label': 'Zambia',
        'currencyLabel': 'Zambian Kwacha',
        'currency': 'ZMW'
      }, {
        'value': 'ZW',
        'value3': 'ZWE',
        'label': 'Zimbabwe',
        'currencyLabel': 'Zimbabwe Dollar',
        'currency': 'ZWL'
      }, {
        'value': 'AT',
        'value3': 'AUT',
        'label': 'Østerrike',
        'currencyLabel': 'Euro',
        'currency': 'EUR'
      }, {
        'value': 'TL',
        'value3': 'TLS',
        'label': 'Øst Timor',
        'currencyLabel': 'US Dollar',
        'currency': 'USD'
      }, {
        'value': 'XX',
        'value3': 'XXX',
        'label': 'Demoland',
        'currencyLabel': 'Demokroner',
        'currency': 'XXX'
      }]
  }

  getData = (locale) => {
    return this.countries[locale]
  }

  findByValue = (locale, value) => {
    return _.find(this.countries[locale], { value: value })
  }

  findByValue3 = (locale, value) => {
    return _.find(this.countries[locale], { value3: value })
  }

  filterByValueOnArray = (locale, needles) => {
    return _.filter(this.countries[locale], it => {
      return needles.indexOf(it.value) >= 0
    })
  }
}

const countryData = new CountryData()
Object.freeze(countryData)
export default countryData
