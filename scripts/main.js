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

let cart = [];
let total = 0;
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
    }

    window.removeItem = function(index) {
        if (cart[index].jumlah > 1) {
            cart[index].jumlah -= 1;
        } else {
            // (Fungsi splice digunakan untuk memotong/menghapus item dari daftar berdasarkan urutannya)
            cart.splice(index, 1);
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        total = 0;

        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyMsg);
            checkoutBtn.style.display = 'none';
            checkoutForm.style.display = 'none'; // Sembunyikan isian nama kalau keranjang kosong
            totalPriceDisplay.textContent = `Rp 0`;
        } else {
            cart.forEach((item, index) => {
                const subTotal = item.harga * item.jumlah;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item-row'; 
                
                itemDiv.innerHTML = `
                    <div class="cart-item">
                        <span class="item-name">${item.nama} <span style="color:#EC1A23; font-weight:bold; margin-left:5px;">(x${item.jumlah})</span></span>
                        <span class="item-price">
                            Rp ${subTotal.toLocaleString('id-ID')} 
                            <button onclick="removeItem(${index})" class="btn-remove">✖</button>
                        </span>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
                total += subTotal;
            });

            totalPriceDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
            checkoutBtn.style.display = 'inline-block';
            checkoutForm.style.display = 'block'; // Munculkan isian nama kalau keranjang ada isinya
        }
    }

    checkoutBtn.addEventListener('click', () => {
        // Mengambil nilai teks yang diketik oleh user di kotak isian
        const namaPemesan = document.getElementById('nama-pemesan').value;
        const catatan = document.getElementById('catatan-pesanan').value;

        // Mencegah user lanjut jika namanya masih kosong
        if (namaPemesan.trim() === "") {
            alert("Halo! Tolong isi 'Atas Nama' dulu ya sebelum pesan.");
            document.getElementById('nama-pemesan').focus(); // Otomatis mengarahkan kursor ke kotak nama
            return; // (Perintah return akan menghentikan proses kode selanjutnya)
        }

        //NO WA
        let nomorWA = "*********"; 
        // Menggabungkan variabel namaPemesan ke dalam teks pembuka WhatsApp
        let pesan = `Halo Bengawan Solo, saya *${namaPemesan}* mau pesan:%0A%0A`;
        
        cart.forEach((item, i) => {
            const subTotal = item.harga * item.jumlah;
            pesan += `${i + 1}. ${item.nama} (x${item.jumlah}) - Rp ${subTotal.toLocaleString('id-ID')}%0A`;
        });
        
        pesan += `%0A*Total Pembayaran: Rp ${total.toLocaleString('id-ID')}*`;

        // Jika user mengisi catatan, tambahkan ke pesan. Jika kosong, abaikan.
        if (catatan.trim() !== "") {
            pesan += `%0A%0A*Catatan Khusus:*%0A${catatan}`;
        }
        
        window.open(`https://wa.me/${nomorWA}?text=${pesan}`, '_blank');
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