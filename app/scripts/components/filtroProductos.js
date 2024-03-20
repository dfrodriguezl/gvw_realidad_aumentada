// Componente para activar o desactivar el modo oscuro

import React, { useState } from 'react';
import { variables } from '../base/variables';
import Select from 'react-select'

const FiltroProductos = () => {
  const [productos, setProductos] = useState(variables.listaProductos);
  const [productoSeleccionado, setProductoSeleccionado] = useState(variables.productoSeleccionado);

  variables.updateListaProductos = (lista) => {
    setProductos(lista);
    variables.updateProductoSeleccionado(lista[2])
    variables.updateProductoResult(lista[2]);
    variables.updateProductoTabla(lista[2]);
  }

  variables.updateProductoSeleccionado = (producto) => {
    //  onChangePeriodo(producto)
    setProductoSeleccionado(producto);
    variables.productoSeleccionado = producto;
    variables.changeTheme("MPIO", 0, "MPIO", "y");
  }

  const onChangePeriodo = (e) => {
    variables.updateProductoSeleccionado(e);
    variables.updateProductoResult(e);
    variables.updateProductoTabla(e);
    variables.closer.click();

  }

  return (
    <div className="tools__panel">
      <p className="tools__text">¿Cuál producto desea ver en el mapa?</p>
      <div className="selectBox">
        <p className="selectBox__name">Producto, presentación:</p>
        <Select
          styles={{
            navBar: provided => ({ zIndex: 99999 })
          }}
          name="form-field-name"
          className="select2-container"
          placeholder="Producto..."
          options={productos}
          value={productoSeleccionado}
          onChange={onChangePeriodo}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      </div>
    </div>
  )
}

export default FiltroProductos;