export const getFeaturedProducts = async () => {
    // Retraso para simular la carga de red
    await new Promise(resolve => setTimeout(resolve, 500)); 

    return [
        { id: 1, name: 'Alfombra Persa Roja', price: 95.50, oldPrice: 120.00, image: 'https://placehold.co/400x300/e9ecef/212529?text=Alfombra+01' },
        { id: 2, name: 'Cortina Blackout Gris', price: 49.99, image: 'https://placehold.co/400x300/adb5bd/212529?text=Cortina+02' },
        { id: 3, name: 'Juego de Toallas de Lujo', price: 35.00, image: 'https://placehold.co/400x300/ced4da/212529?text=Toallas+03' },
        { id: 4, name: 'Accesorios de Baño Kit', price: 65.00, oldPrice: 80.00, image: 'https://placehold.co/400x300/f8f9fa/212529?text=Accesorios+04' },
    ];
};