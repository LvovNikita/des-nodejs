# DES

Реализация симметричного блочного алгоритма шифрования DES. 

Работает как со строками, так и с небольшими файлами (буферами) в режиме ECB.

## Таблицы:

* IP.js — таблица начальной перестановки IP
* E.js — таблица функции расширения E
* IP-1.js — таблица конечной перестановки IP<sup>-1</sup>
* S-Boxes.js — S—блоки
* P.js — P-блоки
* PC-1.js — перестановка битов ключа PC-1
* PC-2.js — перестановка битов ключа PC-2

## Cоздание экземпляра класса

Создание экземпляра класса:

```
const des = new DES(key)
```

Ключ может быть 56-битной строкой или буфером.

При создании экземпляра класса аллоцируются ключ и 16 раундовых ключей статическими методами:

* DES.allocateKey(key)
* DES.generateRoundKeys(this.key)

Экзмепляр класса имеет следующие публичные методы и свойства:

```
des.encrypt(plaintext)  // шифрование
des.decrypt(ciphertext) // расшифрование

des.data                // данные в виде буфера или...
des.dataAsString        // в виде строки
```

Открытый текст и зашифрованный текст могут быть строкой или буфером.

## Пример использования:

В файле *./examples/index.js*:

```
const fs = require('node:fs')       // для шифрования файлов
const DES = require('../index.js')

// Ключ шифрования/расшифрования:
const key = 'SECRETK'

// Создание экземпляра:
const des = new DES(key)

// Шифрование:
const plaintext = 'hello world'
des.encrypt(plaintext)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

// Расшифрование:
const ciphertext = des.data
des.decrypt(ciphertext)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

// Для шифрования файлов:
const file = fs.readFileSync('./input.txt')
des.encrypt(file)
fs.writeFileSync('output', des.data)

// Для расшифрования файлов:
const file2 = fs.readFileSync('./output')
des.decrypt(file2)
fs.writeFileSync('output2.txt', des.data)
```

## Статические методы:

### DES.allocateKey(key)

Ключ может быть 56-битной строкой или буфером. В противном случае он будет зациклен или обрезан до 56 бит.

Из функции возвращается ключ, дополненный битами чётности. Таким образом 56-битный ключ расширяется до 64 бит.

| Ключ                          | Ключ, дополненный битами чётности |
|-------------------------------|-----------------------------------|
| <Buffer 53 45 43 52 45 54 4b> | <Buffer 53 a3 50 6a 24 2b 50 96>  |

### DES.generateRoundKeys(key)

Схема генерации раундовых ключей:

| Этап                               | Длины                |
|------------------------------------|----------------------|
| PC-1 (Permuted Choice 1)           | 64 bit -> 56 bit     |
| Взятие левой и правой частей ключа | 56 bit -> 2 x 28 bit |
| Инициализация раундовых ключей     | 16 x 56 bit          |
| PC-2 (Permuted Choice 2)           | 16 x 48 bit          |

## Генерация раундовых ключей:

### PC-1

Из 64-битного ключа отбросить биты чётности (7, 15, 23, 31, 39, 47, 55, 63) и пермешать их, согласно таблице PC-1 в файле *./tables/PC-1.js*. В результате ключ сжимается до 56 бит.

![PC-1](https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/DES-pc1.svg/400px-DES-pc1.svg.png)

Источник изображения: Wikipedia

### Взятие левой и правой частей ключа

56-битный ключ разделяется на две части (C0, D0) по 28 бит.

### Инициализация раундовых ключей

Инициализируетcя 16 раундовых ключей, в первом раунде получаемых из C<sub>0</sub> и D<sub>0</sub>, а в последующих из C<sub>i-1</sub> и D<sub>i-1</sub> (где i — номер раунда) путём циклического сдвига на n бит влево в зависимости от раунда:

| n | раунды           |
|---|------------------|
| 1 | 1, 2, 9, 16      |
| 2 | 3, 4, 5—8, 10—15 |

Результат — двумерный массив из 16 раундовых ключей длиной 56 битов.

### Permuted Choice 2

56-битные раундовые ключи сжимаются до 48 бит (игнорируются биты: 8, 17, 21, 24, 34, 37, 42, 53), согласно таблице PC-2 в файле *./tables/PC-2.js*.

![PC-2](https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/DES-pc2.svg/400px-DES-pc2.svg.png) 

Источник изображения: Wikipedia

Пример полученных раундовых ключей:

```
[
    <Buffer 11 c6 06 06 13 e5>,
    <Buffer f4 2e 48 6c 60 82>,
    <Buffer 42 f6 20 64 60 4f>,
    <Buffer c8 9d 56 a6 90 ca>,
    <Buffer 64 e2 4b 84 97 63>,
    <Buffer 23 d5 22 1e 8e 60>,
    <Buffer e8 09 d3 58 cd 50>,
    <Buffer 35 e2 19 09 e4 18>,
    <Buffer ac 59 cc 80 1e f9>,
    <Buffer 12 63 49 1b 9a 31>,
    <Buffer 09 5d 31 13 4d 30>,
    <Buffer c5 29 cd 09 29 14>,
    <Buffer 13 e6 81 e1 60 94>,
    <Buffer 59 1d a2 61 02 8f>,
    <Buffer f0 a0 cd 96 10 8f>,
    <Buffer 88 3c b6 39 25 06>
]
```

## Публичные методы экземпляра:

### des.encrypt(plaintext)

Метод принимает буфер или строку в качестве аргумента.

Схема шифрования (см. приватные методы):

| Этап                        | Описание                                           | Размерность блока |
|-----------------------------|----------------------------------------------------|-------------------|
| #allocateBlocks(plaintext)  | Представить входные данные в виде 64-битных блоков | 64 bit            |
| #ip()                       | IP (Initial Permutation) — начальная перестановка  | 64 bit            |
| #getBlocksHalves()          | Разделить блоки на части L и R по 32 бита каждая   | 2 x 32 bit        |
| #f()                        | F — раундовая функция                              | 64 bit на выходе  |
| #fp()                       | FP (Final Permutation) — конечная перестановка     | 64 bit            |

### des.decrypt(buffer)

Схема расшифрования полностью соответствует схеме расшифрования, но с обратным порядком раундовых поключей!

## Приватные методы экземпляра:

### allocateBlocks(plaintext)

Открытый текст дополняюется слева нулями до кратного восьми количества байт. После чего на блоки по 64 бита (8 байт):

```
[ 
    <Buffer 00 00 00 00 00 68 65 6c>, // hel
    <Buffer 6c 6f 20 77 6f 72 6c 64>  // lo world
]
```

### ip()

Реализует начальную перестановку IP бит в блоке, согласно таблице в файле *./tables/IP.js*.

![IP](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/DES-ip-1.svg/400px-DES-ip-1.svg.png) 

Источник изображения: Wikipedia

Блоки после IP:

```
[ 
    <Buffer e0 00 c0 40 00 e0 a0 00>, 
    <Buffer fb 28 db 1a 00 ff 53 3a> 
]
```

### getBlocksHalves()

Блоки разделяются на две части по 32 бита:

```
[
  { L: <Buffer e0 00 c0 40>, R: <Buffer 00 e0 a0 00> },
  { L: <Buffer fb 28 db 1a>, R: <Buffer 00 ff 53 3a> }
]
```

### f()

Раундовая функция. Выполняется 16 раз.

Cхема одной итерации функции:

![Сеть Фейстеля](https://upload.wikimedia.org/wikipedia/commons/2/2c/%D0%A1%D0%B5%D1%82%D1%8C%D0%A41.PNG)

Источник изображения: Wikipedia


| Этап                                                               | Размер R, бит |
|--------------------------------------------------------------------|---------------|
| Запоминается правая часть блока R                                  | 32            |
| expansion() — R расширяется, согласно таблице E                    | 48            |
| xorWhitener() — R складывается по модулю 2 с раундовым ключом      | 48            |
| splitRTo6BitChunks() — R разделяется на 8 блоков по 6 бит          | 8 x 6         |
| sBox() – S-блоки                                                   | 32            |
| pBox() – P-блоки                                                   | 32            |
| L на следующий раунд = значение R из первого пункта                | 32            |
| getNewR() – R на следующий раунд = R складывается по модулю 2 с L  | 32            |
| finalSwap() – Финальная перестановка (после 16-ого раунда)         | 32            |

#### Expansion Function (E)

![E](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/DES-ee.svg/400px-DES-ee.svg.png)

Источник изображения: Wikipedia

Результат расширения правой части первого блока в первом раунде:

```
<Buffer 00 17 01 50 00 00>
```

# [!] Редактируется:

#### R xor RoundKey

48-битная правая часть, побитово складывается по модулю два с соответсвующим 48-битным раундовым ключом.

Результат сложения по модулю 2 правых частей блоков с ключом первого раунда в первом раунде:

```
blocks: [
    {
        L: [...],
        R: [
            0, 0, 0, 1, 0, 0, 0, 1,
            1, 1, 0, 1, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 1, 1, 1,
            0, 1, 0, 1, 0, 1, 1, 0,
            0, 0, 0, 1, 0, 0, 1, 1,
            1, 1, 1, 0, 0, 1, 0, 1
        ]
    },
    {
        L: [...],
        R: [
            0, 0, 0, 1, 0, 0, 0, 1,
            1, 1, 0, 1, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 0, 0, 0,
            1, 0, 1, 0, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 0, 1, 0,
            0, 0, 0, 1, 0, 0, 0, 1
        ]
    }
]
```

#### Деление R на 8 блоков по 6 бит

Результат деления R на 8 блоков по 6 бит:

```
[
    [ 0, 0, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 0, 1 ],
    [ 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1 ],
    [ 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 0, 0, 0, 1 ],
    [ 0, 0, 1, 1, 1, 1 ],
    [ 1, 0, 0, 1, 0, 1 ]
]
[
    [ 0, 0, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 0, 1 ],
    [ 0, 0, 0, 1, 1, 1 ],
    [ 1, 1, 1, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 1 ],
    [ 0, 0, 0, 1, 1, 1 ],
    [ 1, 0, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 1 ]
]
```

#### S-блоки

S-блоки (блоки замены). Каждая из восьми 6-битных частей R поступает на вход одного из восьми блоков замены, определённых в файле *./tables/S-Boxes.js*. Первый и последний биты части блока R определяют номер строки (0-3), а оставшиеся четыре бита номер столбца (0-15) в блоке замены. На выходе из S-блока 6-битная последовательность сжимается до 4 бит. Таким образом 48-битная правая часть блока R сжимается до 32 бит. Иллюстрация:

![S](/docs//S-box.png)

Источник изображения: ResearchGate.net

![S](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/DES-f-function.png/623px-DES-f-function.png)

Источник изображения: Wikipedia

То есть:

```
[
    [ 0, 0, 0, 1, 0, 0 ], = 0 строка, 2 столбец в 1 S-блоке = 13 = 1101
    [ 0, 1, 1, 1, 0, 1 ], = 1 строка, 14 столбец во 2 S-блоке = 11 = 1011
    [ 0, 0, 0, 1, 0, 0 ], = 0 строка, 2 столбец в 3 S-блоке = 9 = 1001
    [ 0, 0, 0, 1, 1, 1 ], = 1 строка, 3 столбец в 4 S-блоке = 5 = 0101
    [ 0, 1, 0, 1, 0, 1 ], = 1 строка, 10 столбец в 5 S-блоке = 15 = 111
    [ 1, 0, 0, 0, 0, 1 ], = 3 строка, 0 столбец в 6 S-блоке = 4 = 0100
    [ 0, 0, 1, 1, 1, 1 ], = 1 строка, 7 столбец в 7 S-блоке = 10 = 1010
    [ 1, 0, 0, 1, 0, 1 ]  = 3 строка, 2 столбец в 8 S-блоке = 14 = 1110
]
[
    [ 0, 0, 0, 1, 0, 0 ], =  0 строка, 2 столбец в 1 S-блоке
    [ 0, 1, 1, 1, 0, 1 ], =  1 строка, 14 столбец во 2 S-блоке
    [ 0, 0, 0, 1, 1, 1 ], =  1 строка, 3 столбец в 3 S-блоке
    [ 1, 1, 1, 0, 0, 0 ], =  2 строка, 12 столбец в 4 S-блоке
    [ 1, 0, 1, 0, 1, 1 ], =  3 строка, 5 столбец в 5 S-блоке
    [ 0, 0, 0, 1, 1, 1 ], =  1 строка, 3 столбец в 6 S-блоке
    [ 1, 0, 1, 0, 0, 0 ], =  2 строка, 4 столбец в 7 S-блоке
    [ 0, 1, 0, 0, 0, 1 ]  =  1 строка, 8 столбец в 8 S-блоке
]
```

Правые части после замены в первом раунде:

```
[
    1, 1, 0, 1,     1, 0, 1, 1,
    1, 0, 0, 1,     0, 1, 0, 1, 
    1, 1, 1, 1,     1, 0, 0, 1, 
    1, 0, 1, 0,     0, 1, 0, 0
]
[
    1, 1, 0, 1,     1, 0, 1, 1, 
    1, 0, 0, 1,     0, 0, 0, 1,
    1, 1, 0, 1,     0, 0, 1, 0,
    0, 1, 0, 0,     1, 1, 0, 0
]
```

#### P-блоки

P-блок (блок перестановки). Правая часть R поступает на вход блока перестановки, определённого в файле *./tables/P.js*.

![P](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/DES-pp.svg/1920px-DES-pp.svg.png)

Источник изображения: Wikipedia

Правые части после перестановки в первом раунде. В первых строках биты 15, 6, 19, 20, 28, 11, 27, 16 правых частей до расширения:

```
[
    1, 1, 1, 1, 0, 1, 0, 1, 
    1, 0, 0, 0, 1, 1, 0, 0, 
    1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 1, 1
]
[
    1, 1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 0,
    1, 1, 0, 0, 0, 0, 0, 1,
    0, 0, 1, 0, 0, 0, 1, 0
]
```

#### Блок на следующий раунд

Получаем новую правую часть R на следующий раунд, путём сложения по модулю 2 бит левой части L и правой части R. 

Новая левая часть L на следующий раунд равна запомненному значению R в начале работы функции (см. схему).

```
blocks: [
    {
        L: [
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ],
        R: [
            0, 0, 0, 1, 0, 1, 0, 1,
            1, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 1, 1, 0, 1, 0, 1,
            1, 1, 1, 0, 0, 0, 1, 1
        ]
    },
    {
        L: [
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1,
            0, 1, 0, 1, 0, 0, 1, 1, 
            0, 0, 1, 1, 1, 0, 1, 0
        ],
        R: [
            0, 0, 0, 1, 0, 1, 1, 0, 
            1, 0, 0, 1, 0, 1, 0, 0, 
            0, 0, 0, 1, 1, 0, 1, 0,
            0, 0, 1, 1, 1, 0, 0, 0
        ]
    }
  ]
```

#### Финальная перестановка

После 16 раундов полученные части склеиваются.

Результат

```
blocks: [
    [
        1, 0, 1, 0, 0, 0, 1, 1, 
        1, 1, 1, 1, 1, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 1,
        1, 1, 0, 1, 1, 0, 0, 1,
        0, 0, 1, 0, 1, 0, 0, 0,
        1, 1, 0, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 1, 0, 0, 
        0, 0, 0, 1, 1, 0, 1, 0
    ],
    [
        1, 0, 0, 0, 0, 1, 1, 0, 
        1, 1, 1, 1, 0, 0, 0, 0, 
        1, 0, 0, 1, 1, 0, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 0, 
        1, 0, 1, 0, 1, 0, 1, 1,
        1, 0, 1, 1, 1, 1, 1, 1,
        0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 1, 0, 0, 0
    ]
]
```

### fp()

Конечная перестановка бит блоков IP<sup>-1</sup>

![IP-1](https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Permutation_initiale.svg/1024px-Permutation_initiale.svg.png)

Результат перестановки. В первых строках биты 39, 7, 47, 15, 55, 23, 63, 31 блоков до перестановки:

```
blocks: [
    [
        0, 1, 1, 1, 0, 1, 0, 1, = 0x75
        0, 1, 1, 0, 0, 0, 1, 0, = 0x62
        0, 0, 0, 0, 1, 0, 0, 0, = 0x08
        1, 0, 1, 1, 1, 1, 1, 1, = 0xbf
        0, 0, 1, 1, 1, 0, 1, 1, = 0x3b
        1, 1, 0, 1, 0, 0, 0, 0, = 0xd0
        0, 0, 1, 1, 0, 0, 0, 1, = 0x31
        0, 1, 1, 1, 0, 1, 0, 1  = 0x75
    ],
    [
        1, 0, 1, 0, 0, 1, 0, 0, = 0xa4
        1, 1, 1, 0, 1, 1, 0, 1, = 0xed
        0, 1, 1, 0, 1, 0, 0, 1, = 0x69
        1, 0, 1, 0, 0, 1, 1, 1, = 0xa7
        0, 0, 1, 1, 0, 1, 1, 1, = 0x37
        1, 0, 1, 1, 1, 0, 0, 1, = 0xb9
        0, 0, 0, 1, 1, 0, 0, 1, = 0x19
        1, 1, 1, 1, 0, 1, 0, 1  = 0xf5
    ]
]
```

### blocksToBuffer()

Представление блоков в виде буфера:

```
<Buffer 75 62 08 bf 3b d0 31 75 a4 ed 69 a7 37 b9 19 f5>
```

В виде строки:

```
u�;�1u��i�7�
```