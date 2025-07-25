import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
const ListPlataformas = () => {
  const API = "http://localhost:3002/plataformas";
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedplataformas, setSelectedPlataformas] = useState(null);
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
  const handleViewDetails = (plataformas) => {
    setSelectedPlataformas(plataformas);
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
  const header = renderHeader();
  
     if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Cargando Géneros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-5 text-danger">
                <h4>Error al cargar los Géneros</h4>
                <p>{error}</p>
            </div>
        );
    }

  return (
    <div className="container">
            <h4 className="text-center py-4">Lista de Géneros</h4>
            <div className="card">
                <DataTable 
                    ref={dt}
                    value={datos} 

                    dataKey="idplataforma"
                    emptyMessage="No se encontraron plataformas."
                    filters={filters}
                    globalFilterFields={['nombre', 'descripcion']}
                    header={header}
                >
                    <Column field="idplataforma" header="ID" sortable style={{ width: '10%' }} className="text-center"></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ width: '30%' }}></Column>
                    <Column field="descripcion" header="Descripción" style={{ width: '45%' }}></Column>
                    <Column header="Acciones" body={actionBodyTemplate} style={{ width: '5%' }} className="text-center"></Column>
                </DataTable>
            </div>

            <Dialog
                visible={visible} 
                style={{ width: '500px' }} 
                header="Detalles del Género" 
                modal 
                footer={modalFooter} 
                onHide={() => setVisible(false)}
            >
                {selectedplataformas && (
                    <div className="card p-4">
                        <div className="card-header">
                            <div className="py-2">
                                <h4><strong>ID: </strong>{selectedplataformas.idplataforma}</h4>
                            </div>
                            <div className="py-2">
                                <h5><strong>Nombre: </strong>{selectedplataformas.nombre}</h5>
                            </div>
                            <div className="py-2">
                                <h5><strong>Descripción: </strong>{selectedplataformas.descripcion}</h5>
                            </div>
                        
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
)
};

export default ListPlataformas;
