import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
const ListJuegos = () => {
  const API = "http://localhost:3002/juegos";
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedjuegos, setSelectedjuegos] = useState(null);
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
  const handleViewDetails = (juegos) => {
    setSelectedjuegos(juegos);
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
                value={rowData.nstatus === 'activo' ? 'Activo' : 'Inactivo'} 
                severity={rowData.nstatus === 'activo' ? 'success' : 'danger'} 
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
                <p>Cargando juegos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-5 text-danger">
                <h4>Error al cargar los juegos</h4>
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
            <h4 className="text-center py-4">Lista de juegos</h4>
            <div className="card">
                <DataTable 
                    ref={dt}
                    value={datos} 

                    dataKey="idjuego"
                    emptyMessage="No se encontraron plataformas."
                    filters={filters}
                    globalFilterFields={['nombre', 'descripcion']}
                    header={header}
                >
                    <Column field="idjuego" header="ID" sortable style={{ width: '10%' }} className="text-center"></Column>
                    <Column field="ngenero" header="genero" sortable style={{ width: '10%' }} className="text-center"></Column>
                    <Column field="njuegos" header="Nombre" sortable style={{ width: '30%' }} className="text-center"></Column>
                    <Column field="djuegos" header="Descripción" style={{ width: '45%' }}className="text-center"></Column>
                    <Column field="nstatus" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10%' }} className="text-center"></Column>
                    <Column header="Acciones" body={actionBodyTemplate} style={{ width: '5%' }} className="text-center"></Column>
                </DataTable>
            </div>

            <Dialog
                visible={visible} 
                style={{ width: '500px' }} 
                header="Detalles del juego" 
                modal 
                footer={modalFooter} 
                onHide={() => setVisible(false)}
            >
                {selectedjuegos && (
                    <div className="card p-4">
                        <div className="card-header">
                        <img src={selectedjuegos.imagen} alt={selectedjuegos.njuegos} />
                        </div>
                        <div className="card-body">
                            <div className="py-2">
                                <h4><strong>valoracion: </strong>{selectedjuegos.valoracion}</h4>
                            </div>
                            <div className="py-2">
                                <h4><strong>ID: </strong>{selectedjuegos.idjuego}</h4>
                            </div>
                            <div className="py-2">
                                <h5><strong>Nombre: </strong>{selectedjuegos.njuegos}</h5>
                            </div>
                            <div className="py-2">
                                <h5><strong>Descripción: </strong>{selectedjuegos.djuegos}</h5>
                            </div>
                                                        <div className="py-2">
                                <h5><strong>publicacion: </strong>{cleanAndFormatDate(selectedjuegos.fechapublicacion)}</h5>
                            </div>

                                                        <div className="py-2">
                                <h5><strong>precio: </strong>{selectedjuegos.precio}</h5>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
)
};

export default ListJuegos;
