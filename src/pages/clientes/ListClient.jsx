import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
const Listclientes = () => {
  const API = "http://localhost:3002/clientes";
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedclientes, setSelectedclientes] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const dt = useRef(null);

  const getDatos = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDatos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatos();
  }, []);
  const handleViewDetails = (clientes) => {
    setSelectedclientes(clientes);
    setVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info"
        onClick={() => handleViewDetails(rowData)}
        tooltip="Ver detalles"
      />
    );
  };

  const modalFooter = (
    <Button
      label="Cerrar"
      icon="pi pi-times"
      onClick={() => setVisible(false)}
      className="p-button-text"
    />
  );
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };
  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <div className="d-flex justify-content-end align-items-center">
        <span className="p-input-icon-left mx-2">
          <i className="pi pi-search mx-1" />
          <InputText
            value={value || ""}
            onChange={onGlobalFilterChange}
            placeholder="Buscar... "
            className="w-100 px-4 "
          />
        </span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.activo === 1 ? "Activo" : "Inactivo"}
        severity={rowData.activo === 1 ? "success" : "danger"}
      />
    );
  };
  const header = renderHeader();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <h4>Error al cargar los clientes</h4>
        <p>{error}</p>
      </div>
    );
  }
  function cleanAndFormatDate(isoDateString) {
  // Convertimos la cadena ISO a un objeto Date
  const date = new Date(isoDateString);

  // Obtenemos día, mes (sumando 1 porque empieza en 0) y año
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // Retornamos el formato deseado
  return `${day}/${month}/${year}`;
}

  return (
    <div className="container">
      <h4 className="text-center py-4">Lista de clientes</h4>
      <div className="card">
        <DataTable
          ref={dt}
          value={datos}
          dataKey="id"
          emptyMessage="No se encontraron plataformas."
          filters={filters}
          globalFilterFields={["nombre", "descripcion"]}
          header={header}
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "10%" }}
            className="text-center"
          ></Column>
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ width: "10%" }}
            className="text-center"
          ></Column>
          <Column
            field="activo"
            header="Estado"
            body={statusBodyTemplate}
            sortable
            style={{ width: "10%" }}
            className="text-center"
          ></Column>
          <Column
            header="Acciones"
            body={actionBodyTemplate}
            style={{ width: "5%" }}
            className="text-center"
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        style={{ width: "500px" }}
        header="Detalles del cliente"
        modal
        footer={modalFooter}
        onHide={() => setVisible(false)}
      >
        {selectedclientes && (
          <div className="card p-4">
            <div className="card-header">
              {" "}
              <div className="py-2">
                <h4>
                  <strong>ID: </strong>
                  {selectedclientes.id}
                </h4>
              </div>
              <div className="py-2">
                <h5>
                  <strong>Nombre: </strong>
                  {selectedclientes.nombre}
                </h5>
              </div>
              <div className="py-2">
                <h5>
                  <strong>telefono: </strong>
                  {selectedclientes.telefono}
                </h5>
              </div>
              <div className="py-2">
                <h5>
                  <strong>correo: </strong>
                  {selectedclientes.correo_electronico}
                </h5>
              </div>
                            <div className="py-2">
                <h5>
                  <strong>direccion: </strong>
                  {selectedclientes.direccion}
                </h5>
              </div>
              <div className="py-2">
                <h5>
                  <strong>fecha de registro: </strong> {cleanAndFormatDate(selectedclientes.fecha_registro)}
                </h5>
              </div>

              
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Listclientes;
