/*
=================================================
          VARIABEL GLOBAL & INISIALISASI
=================================================
*/
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Cek apakah tombol hamburger ada di halaman ini
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('aktif');
    });
}

// ini fitur search & filter
const searchInput = document.getElementById('search-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.card');

let filterAktif = 'all';

function filterMenu() {
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';

    menuCards.forEach(card => {
        const namaMenu = card.querySelector('h3').textContent.toLowerCase();
        const kategori = card.getAttribute('data-kategori');

        const cocokSearch = namaMenu.includes(keyword);
        const cocokKategori = filterAktif === 'all' || kategori === filterAktif;

        card.style.display = cocokSearch && cocokKategori ? 'block' : 'none';
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterMenu);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        filterAktif = button.getAttribute('data-filter');
        filterMenu();
    });
});

let cart = [];
let total = 0;
const floatingCart = document.getElementById('floating-cart');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart-btn');

/*
=================================================
      AKHIR VARIABEL GLOBAL & INISIALISASI
=================================================
*/


/*
=================================================
             SLIDER ULASAN (CAROUSEL)
=================================================
*/
const track = document.getElementById('slider-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const slides = document.querySelectorAll('.slide-card');

// Hanya jalan kalau ada elemen slider di halaman ini
if (track && prevBtn && nextBtn) {
    let slideSaatIni = 0;

    function perbaruiPosisiSlider() {
        track.style.transform = `translateX(-${slideSaatIni * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        if (slideSaatIni < slides.length - 1) {
            slideSaatIni++;
        } else {
            slideSaatIni = 0;
        }
        perbaruiPosisiSlider();
    });

    prevBtn.addEventListener('click', () => {
        if (slideSaatIni > 0) {
            slideSaatIni--;
        } else {
            slideSaatIni = slides.length - 1;
        }
        perbaruiPosisiSlider();
    });
}
/*
=================================================
          AKHIR SLIDER ULASAN (CAROUSEL)
=================================================
*/


/*
=================================================
   FUNGSI MANAJEMEN KERANJANG & TOMBOL PESAN
=================================================
*/
const buttons = document.querySelectorAll('.btn-card');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceDisplay = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyMsg = document.getElementById('empty-cart-msg');
const checkoutForm = document.getElementById('checkout-form'); // Mengambil form isian

// Hanya jalan kalau ada keranjang di halaman ini
if (cartItemsContainer) {

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const nama = button.getAttribute('data-nama');
            const hargaTeks = button.previousElementSibling.textContent;

            // (Fungsi replace digunakan untuk menghapus tulisan "Rp " dan titik agar murni jadi angka)
            const harga = parseInt(hargaTeks.replace('Rp ', '').replace('.', ''));

            addToCart(nama, harga);
            showToast(`Berhasil menambah ${nama}`);
        });
    });

    function addToCart(nama, harga) {
        // (Fungsi findIndex digunakan untuk mencari posisi barang yang sama di dalam keranjang)
        const indexItem = cart.findIndex(item => item.nama === nama);

        if (indexItem !== -1) {
            cart[indexItem].jumlah += 1;
        } else {
            // (Fungsi push digunakan untuk memasukkan data baru ke barisan paling belakang)
            cart.push({ nama: nama, harga: harga, jumlah: 1 });
        }

        updateCartUI();
        simpanCart();
    }

    function simpanCart() {
        localStorage.setItem('cartBengawanSolo', JSON.stringify(cart));
    }

    function ambilCart() {
        const dataCart = localStorage.getItem('cartBengawanSolo');

        if (dataCart) {
            cart = JSON.parse(dataCart);
            updateCartUI();
        }
    }

    ambilCart();

    window.removeItem = function (index) {
        if (cart[index].jumlah > 1) {
            cart[index].jumlah -= 1;
        } else {
            // (Fungsi splice digunakan untuk memotong/menghapus item dari daftar berdasarkan urutannya)
            cart.splice(index, 1);
        }
        updateCartUI();
        simpanCart();
    }

    window.tambahItem = function (index) {
        cart[index].jumlah += 1;
        updateCartUI();
        simpanCart();
    }

    window.kurangiItem = function (index) {
        if (cart[index].jumlah > 1) {
            cart[index].jumlah -= 1;
        } else {
            cart.splice(index, 1);
        }

        updateCartUI();
        simpanCart();
    }

    window.hapusItem = function (index) {
        cart.splice(index, 1);
        updateCartUI();
        simpanCart();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        total = 0;
        let jumlahItemCart = 0;

        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyMsg);
            checkoutBtn.style.display = 'none';
            checkoutForm.style.display = 'none';
            totalPriceDisplay.textContent = `Rp 0`;

            if (clearCartBtn) {
                clearCartBtn.style.display = 'none';
            }

            if (floatingCart && cartCount) {
                cartCount.textContent = 0;
                floatingCart.style.display = 'none';
            }

        } else {
            cart.forEach((item, index) => {
                const subTotal = item.harga * item.jumlah;
                jumlahItemCart += item.jumlah;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item-row';

                itemDiv.innerHTML = `
                <div class="cart-item">
                    <span class="item-name">${item.nama}</span>

                    <div class="qty-control">
                        <button onclick="kurangiItem(${index})">−</button>
                        <span>${item.jumlah}</span>
                        <button onclick="tambahItem(${index})">+</button>
                    </div>

                    <span class="item-price">
                        Rp ${subTotal.toLocaleString('id-ID')}
                        <button onclick="hapusItem(${index})" class="btn-remove">✖</button>
                    </span>
                </div>
            `;

                cartItemsContainer.appendChild(itemDiv);
                total += subTotal;
            });

            totalPriceDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
            if (floatingCart && cartCount) {
                cartCount.textContent = jumlahItemCart;
                floatingCart.style.display = jumlahItemCart > 0 ? 'block' : 'none';
            }
            checkoutBtn.style.display = 'inline-block';
            checkoutForm.style.display = 'block';

            if (clearCartBtn) {
                clearCartBtn.style.display = 'inline-block';
            }
        }
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            const yakin = confirm("Yakin ingin mengosongkan keranjang?");

            if (yakin) {
                cart = [];
                updateCartUI();
                simpanCart();
                showToast("Keranjang berhasil dikosongkan");
            }
        });
    }

    if (floatingCart) {
        floatingCart.addEventListener('click', () => {
            document.getElementById('cart').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        const namaPemesan = document.getElementById('nama-pemesan').value;
        const catatan = document.getElementById('catatan-pesanan').value;
        const metodeBayar = document.getElementById('metode-bayar').value;

        if (namaPemesan.trim() === "") {
            alert("Halo! Tolong isi 'Atas Nama' dulu ya sebelum pesan.");
            document.getElementById('nama-pemesan').focus();
            return;
        }

        checkoutBtn.classList.add('loading');
        checkoutBtn.textContent = "Memproses pesanan...";

        const orderID = "BS-" + Date.now().toString().slice(-6);
        const orderBaru = {
            orderID: orderID,
            nama: namaPemesan,
            metode: metodeBayar,
            total: total,
            catatan: catatan,
            items: cart,
            status: metodeBayar === "QRIS" ? "Menunggu Pembayaran QRIS" : "Menunggu Pembayaran Cash"
        };

        const dataOrderLama = JSON.parse(localStorage.getItem('orderBengawanSolo')) || [];
        dataOrderLama.push(orderBaru);
        localStorage.setItem('orderBengawanSolo', JSON.stringify(dataOrderLama));

        let invoiceText = `Order ID: ${orderID}\n`;
        invoiceText += `Nama: ${namaPemesan}\n`;
        invoiceText += `Metode Pembayaran: ${metodeBayar}\n\n`;
        invoiceText += `Daftar Pesanan:\n`;

        cart.forEach((item, i) => {
            const subTotal = item.harga * item.jumlah;
            invoiceText += `${i + 1}. ${item.nama} x${item.jumlah} - Rp ${subTotal.toLocaleString('id-ID')}\n`;
        });

        invoiceText += `\nTotal: Rp ${total.toLocaleString('id-ID')}\n`;

        if (catatan.trim() !== "") {
            invoiceText += `\nCatatan:\n${catatan}\n`;
        }

        if (metodeBayar === "QRIS") {
            invoiceText += `\nSilakan bayar menggunakan QRIS yang tersedia, lalu kirim bukti pembayaran ke admin.`;
        } else {
            invoiceText += `\nSilakan bayar cash ke kasir saat pesanan diproses.`;
        }

        setTimeout(() => {
            checkoutBtn.classList.remove('loading');
            checkoutBtn.textContent = "Buat Invoice Pesanan";
            tampilkanInvoice(invoiceText);
        }, 1200);
        tampilkanInvoice(invoiceText);
    });
}
/*
=================================================
   AKHIR FUNGSI MANAJEMEN KERANJANG & TOMBOL PESAN
=================================================
*/


/*
=================================================
          FUNGSI WHATSAPP & NOTIFIKASI
=================================================
*/
function showToast(message) {
    const toast = document.getElementById('toast');

    // Sabuk pengaman untuk toast
    if (toast) {
        const toastText = document.getElementById('toast-text');
        toastText.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
/*
=================================================
        AKHIR FUNGSI WHATSAPP & NOTIFIKASI
=================================================
*/

// fungsi invoice ini
let invoiceTerakhir = "";

function tampilkanInvoice(invoiceText) {
    invoiceTerakhir = invoiceText;

    const invoiceModal = document.getElementById('invoice-modal');
    const invoiceContent = document.getElementById('invoice-content');

    invoiceContent.innerHTML = `
    <div class="invoice-success">✅ Invoice berhasil dibuat</div>
    <pre>${invoiceText}</pre>
`;
    invoiceModal.style.display = 'flex';
}

const closeInvoice = document.getElementById('close-invoice');
const copyInvoice = document.getElementById('copy-invoice');
const sendWaInvoice = document.getElementById('send-wa-invoice');

if (closeInvoice) {
    closeInvoice.addEventListener('click', () => {
        document.getElementById('invoice-modal').style.display = 'none';
    });
}

if (copyInvoice) {
    copyInvoice.addEventListener('click', () => {
        navigator.clipboard.writeText(invoiceTerakhir);
        showToast("Invoice berhasil disalin");
    });
}

if (sendWaInvoice) {
    sendWaInvoice.addEventListener('click', () => {
        const nomorWA = "6280000000000"; // ganti dengan nomor admin
        const pesan = encodeURIComponent(invoiceTerakhir);
        window.open(`https://wa.me/${nomorWA}?text=${pesan}`, '_blank');
    });
}