import showErrors from "../errors"

const params = new URLSearchParams(window.location.search)
const prodId = params.get('prodId')
const token = localStorage.getItem('token')

const fetchDeleteProduct = async (prodId) => {
    try {
        const result = await fetch(`http://localhost:3000/admin/delete-product`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prodId: prodId
            })
        })
        const data = await result.json()
        if(result.ok) {
            alert(data.message)
            window.location.href = '/html/admin/my-products.html'
        }
    } catch(err) {
        console.log(err)
    }
}

const productSection = (product) => {
    const { title, description, price, image } = product;

    // Crea il container principale
    const container = document.createElement('section');
    container.className = 'product-delete-preview';

    // Aggiungi il titolo
    const h1 = document.createElement('h1');
    h1.textContent = title;
    container.appendChild(h1);

    // Aggiungi l'immagine
    const img = document.createElement('img');
    img.src = image;
    img.alt = title;
    img.style.width = '200px'; // dimensione minima
    container.appendChild(img);

    // Aggiungi il prezzo
    const pPrice = document.createElement('p');
    pPrice.textContent = `€${price}`;
    container.appendChild(pPrice);

    // Aggiungi la descrizione
    const pDesc = document.createElement('p');
    pDesc.textContent = description;
    container.appendChild(pDesc);

    // Pulsante per confermare la cancellazione
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Product';
    deleteBtn.addEventListener('click', () => {
        fetchDeleteProduct(prodId); // funzione da creare per fare la DELETE
    });
    container.appendChild(deleteBtn);

    // Inserisci il tutto nel body o in un div specifico
    document.body.appendChild(container);
}


const getProductToDelete = async () => {
    const result = await fetch(`http://localhost:3000/admin/delete-product?prodId=${prodId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await result.json()
    productSection(data.product)
    if(result.ok) {
        console.log('almeno il get funzia letsgoski')
    }
}
getProductToDelete()