# language: es

@Api
Característica: Pruebas de una API usando Axios

Antecedentes:
Dado que el endpoint de la API es "https://dummyjson.com"

Escenario: Obtener datos de una API
  Cuando hago una solicitud GET a "/products/1"
  Entonces la respuesta debería tener un código de estado 200
  Y la respuesta debería tener las siguientes propiedades:
  | title              | iPhone 9                                    |
  | description        | An apple mobile which is nothing like apple |
  | price              | 549                                         |
  | discountPercentage | 12.96                                       |

Escenario: Enviar datos a una API
  Cuando hago una solicitud POST a "/products/add" con los siguientes datos:
  | title              | Amazon Echo Dot    |
  | description        | Producto de Amazon |
  | price              | 60                 |
  Entonces la respuesta debería tener un código de estado 200

Escenario: Actualizar datos de una API
  Cuando hago una solicitud PATCH a "/products/1" con los siguientes datos:
  | title              | iPhone 14 |
  | description        | New phone |
  | price              | 700       |
  Entonces la respuesta debería tener un código de estado 200

Escenario: Eliminar datos de una API
  Cuando hago una solicitud DELETE para eliminar el producto con id "30"
  Entonces la respuesta debería tener un código de estado 200

Escenario: Enviar diferentes consultas a una API
  Cuando agrego los siguientes productos a la API:
    | title                    | description           | price |
    | Amazon Echo Dot          | Producto de Amazon    | 60    |
    | Apple iPhone 12          | Smartphone de Apple   | 800   |
    | Samsung Galaxy S20       | Smartphone de Samsung | 900   |
    | Samsung Galaxy S21 Ultra | Smartphone de Samsung | 1000  |
  Entonces la respuesta debería tener un código de estado 200
  Y hago una solicitud DELETE para eliminar los siguientes productos de la API:
      | id |
      | 10 |
      | 32 |
      | 28 |
      | 97 |
  Entonces la respuesta debería tener un código de estado 200

Escenario: Eliminar varios datos a una API 
  Cuando hago una solicitud DELETE para eliminar los siguientes productos de la API:
      | id |
      | 10 |
      | 32 |
      | 28 |
  Entonces la respuesta debería tener un código de estado 200

@csv
Escenario: Enviar datos de un csv a una API
  Cuando Leo el archivo csv
  Entonces agrego productos a la API con los siguientes parámetros:
    | title                    | description           | price |