import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const LayoutCliente = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            {/* Margen para que el contenido no quede debajo del Header fixed-top */}
            <main className="flex-grow-1" style={{ paddingTop: '150px' }}> 
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default LayoutCliente;