const adminOrderList = document.getElementById('admin-order-list');

function tampilkanOrderAdmin() {
    const dataOrder = JSON.parse(localStorage.getItem('orderBengawanSolo')) || [];

    adminOrderList.innerHTML = '';

    if (dataOrder.length === 0) {
        adminOrderList.innerHTML = `<p class="empty-msg">Belum ada pesanan masuk.</p>`;
        return;
    }

    dataOrder.forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.className = 'admin-order-card';

        orderCard.innerHTML = `
            <div class="admin-order-header">
                <h3>${order.orderID}</h3>
                <span class="status-badge">${order.status}</span>
            </div>

            <p><strong>Nama:</strong> ${order.nama}</p>
            <p><strong>Metode Bayar:</strong> ${order.metode}</p>
            <p><strong>Total:</strong> Rp ${order.total.toLocaleString('id-ID')}</p>
            <p><strong>Catatan:</strong> ${order.catatan || '-'}</p>

            <h4>Pesanan:</h4>
            <ul>
                ${order.items.map(item => `
                    <li>${item.nama} x${item.jumlah} - Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</li>
                `).join('')}
            </ul>

            <div class="admin-actions">
                <button onclick="ubahStatus(${index}, 'Diproses')">Diproses</button>
                <button onclick="ubahStatus(${index}, 'Selesai')">Selesai</button>
                <button onclick="hapusOrder(${index})" class="btn-delete-order">Hapus</button>
            </div>
        `;

        adminOrderList.appendChild(orderCard);
    });
}

function ubahStatus(index, statusBaru) {
    const dataOrder = JSON.parse(localStorage.getItem('orderBengawanSolo')) || [];

    dataOrder[index].status = statusBaru;

    localStorage.setItem('orderBengawanSolo', JSON.stringify(dataOrder));
    tampilkanOrderAdmin();
}

function hapusOrder(index) {
    const yakin = confirm("Yakin ingin menghapus pesanan ini?");
    if (!yakin) return;

    const dataOrder = JSON.parse(localStorage.getItem('orderBengawanSolo')) || [];

    dataOrder.splice(index, 1);

    localStorage.setItem('orderBengawanSolo', JSON.stringify(dataOrder));
    tampilkanOrderAdmin();
}

tampilkanOrderAdmin();