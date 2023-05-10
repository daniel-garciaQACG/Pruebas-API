const { Given, When, Then } = require('@wdio/cucumber-framework');
const allureReporter = require('@wdio/allure-reporter').default
const axios = require('axios');
const { expect } = require('chai');
let respuesta;

Given('que el endpoint de la API es {string}', function (endpoint) {
    this.endpoint = endpoint;
});

When('hago una solicitud GET a {string}', async function (path) {
  try{
    respuesta = await axios.get(`${this.endpoint}${path}`);
    allureReporter.addStep(`Producto encontrado: ${JSON.stringify(respuesta.data)}`);
  }catch (error) {
    if (error.response.status === 404) {
      allureReporter.startStep(`El producto con id ${path} no existe`);
      allureReporter.endStep('failed');
      throw error;
    }else {
      allureReporter.startStep(`Error inesperado al encontrar el producto con id ${id}`);
      allureReporter.endStep('failed');
      throw error;
    }
  }
});

Then('la respuesta debería tener un código de estado {int}', function (statusCode) {
  try{
    expect(respuesta.status).to.equal(statusCode);
  }catch(error){
    allureReporter.startStep(`No se recibió la respuesta esperada ${error.response.status}`);
    allureReporter.endStep('failed');
    throw error;
  }
});

Then('la respuesta debería tener las siguientes propiedades:', async function (dataTable) {
    const requestData = dataTable.rowsHash();
    await validarPropiedades(respuesta, requestData);
});

When('hago una solicitud POST a {string} con los siguientes datos:', async function (path, dataTable) {
  const requestData = dataTable.rowsHash();
  try{
    respuesta = await axios.post(`${this.endpoint}${path}`, requestData);
    await validarPropiedades(respuesta, requestData);
    allureReporter.addStep(`Producto agregado: ${JSON.stringify(requestData)}`);
  }catch (error) {
    allureReporter.startStep(`Error inesperado agregando el producto ${JSON.stringify(requestData)}`);
    allureReporter.endStep('failed');
    throw error;
  }
});

When('hago una solicitud PATCH a {string} con los siguientes datos:', async function (path, dataTable) {
  const requestData = dataTable.rowsHash();
  try{
    respuesta = await axios.patch(`${this.endpoint}${path}`, requestData);
    await validarPropiedades(respuesta, requestData);
    allureReporter.addStep(`Producto actualizado: ${JSON.stringify(requestData)}`);
  }catch (error) {
    allureReporter.startStep(`Error inesperado actualizando el producto ${JSON.stringify(requestData)}`);
    allureReporter.endStep('failed');
    throw error;
  }
});


When('hago una solicitud DELETE para eliminar el producto con id {string}', async function (id) {
  try{
    respuesta = await axios.delete(`${this.endpoint}/products/${id}`);
    const actualProperties = respuesta.data;
    expect(actualProperties).to.have.property('isDeleted', true);
    allureReporter.addStep(`Producto eliminado: ${JSON.stringify(respuesta.data)}`);
  }catch (error) {
    if (error.response.status === 404) {
      allureReporter.startStep(`El producto con id ${id} no existe`);
      allureReporter.endStep('failed');
      throw error;
    }else {
      allureReporter.startStep(`Error inesperado al eliminar el producto con id ${id}`);
      allureReporter.endStep('failed');
      throw error;
    }
  }
});

When('agrego los siguientes productos a la API:', async function (dataTable) {
  const data = dataTable.hashes();
  for (let i = 0; i < data.length; i++) {
    try{
      const requestData = data[i];
      respuesta = await axios.post(`${this.endpoint}/products/add`, requestData);
      await validarPropiedades(respuesta, requestData);
      allureReporter.addStep(`Producto agregado: ${JSON.stringify(requestData)}`);
    }catch (error) {
      allureReporter.startStep(`Error inesperado agregando el producto ${JSON.stringify(requestData)}`);
      allureReporter.endStep('failed');
      throw error;
    }
  }
});

When('hago una solicitud DELETE para eliminar los siguientes productos de la API:', async function (dataTable) {
  const data = dataTable.hashes();
    for (let i = 0; i < data.length; i++) {
      const id = data[i].id;
      try{
        respuesta = await axios.delete(`${this.endpoint}/products/${id}`);

        allureReporter.addStep(`Producto eliminado con id: ${id}: ${JSON.stringify(respuesta.data)}`);
      }catch (error) {
        if (error.response.status === 404) {
          allureReporter.startStep(`El producto con id ${id} no existe`);
          allureReporter.endStep('failed');
          throw error;
        }else {
          allureReporter.startStep(`Error inesperado eliminando producto con id ${id}`);
          allureReporter.endStep('failed');
          throw error;
        }
      }
    }
});



async function validarPropiedades(respuesta, expectedProperties) {
  const actualProperties = respuesta.data;
  for (const [property, expectedValue] of Object.entries(expectedProperties)) {
    const actualValue = actualProperties[property];
    if (actualValue === undefined) {
      allureReporter.startStep(`La propiedad ${property} no existe`);
      allureReporter.endStep('failed');
      throw error;
    }
    else if (typeof actualValue === 'string') {
      expect(actualValue).to.equal(expectedValue);
    } else if (typeof actualValue === 'number') {
      if (Number.isInteger(actualValue)) {
        expect(actualValue).to.equal(parseInt(expectedValue));
      } else {
        expect(actualValue).to.equal(parseFloat(expectedValue));
      }
    } else {
      allureReporter.startStep(`Tipo de dato desconocido para la propiedad ${property}`);
      allureReporter.endStep('failed');
      throw error;
    }
  }
}