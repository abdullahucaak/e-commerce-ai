<template>
    <div class="dashboard">
        <nav class="dashboard-nav">
            <div class="logo">
                <img class="logo" src="../../assets/Alaya-Logo_300x300.jpg" alt="Logo">
            </div>
            <div class="nav-links">
                <RouterLink to="/cms/dashboard" class="nav-link" active-class="active">
                    <i class="fas fa-home"></i> Ana Sayfa
                </RouterLink>
                <RouterLink to="/cms/products" class="nav-link" active-class="active">
                    <i class="fas fa-box"></i> Ürünler
                </RouterLink>
                <RouterLink to="/cms/completed-orders" class="nav-link" active-class="active">
                    <i class="fas fa-shopping-cart"></i> Siparişler
                </RouterLink>
                <button @click="handleLogout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                </button>
            </div>
        </nav>
        
        <div class="dashboard-content">
            <header class="content-header">
                <h1>Ürün Yönetimi</h1>
                <button class="add-product-btn" @click="showAddProductModal = true">
                    <i class="fas fa-plus"></i> Yeni Ürün Ekle
                </button>
            </header>
            
            <div class="products-grid">
                <div v-for="product in products" :key="product.id" class="product-card">
                    <div class="product-image" :style="{ 'background-image': `url(/images/${product.photo[0]})` }"></div>
                    <div class="product-info">
                        <div class="product-name">{{ product.name }}</div>
                        <p class="price">${{ product.price }}</p>
                        <div class="actions">
                            <button class="edit-btn" @click="editProduct(product)">
                                <i class="fas fa-edit"></i> Düzenle
                            </button>
                            <button class="delete-btn" @click="deleteProduct(product.id)">
                                <i class="fas fa-trash"></i> Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const router = useRouter()
const productStore = useProductStore()
const products = ref([])
const showAddProductModal = ref(false)

onMounted(async () => {
    if (!localStorage.getItem('isAdmin')) {
        router.push('/cms/login')
        return
    }
    
    await productStore.getProducts()
    products.value = productStore.products
})

const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/cms/login')
}

const editProduct = (product) => {
    // Ürün düzenleme fonksiyonu eklenecek
    console.log('Edit product:', product)
}

const deleteProduct = async (productId) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        // Ürün silme fonksiyonu eklenecek
        console.log('Delete product:', productId)
    }
}
</script>

<style scoped>
img.logo {
    border-radius: 50%;
    object-fit: cover;
}

.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
}

.dashboard-nav {
    background-color: #1B9C85;
    color: white;
    padding: 2rem;
}

.logo {
    text-align: center;
    margin-bottom: 2rem;
}

.logo img {
    width: 120px;
    height: auto;
}

.nav-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-link:hover, .nav-link.active {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link i {
    margin-right: 0.5rem;
}

.logout-btn {
    margin-top: auto;
    background: none;
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
}

.logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-content {
    padding: 2rem;
    background-color: #f5f5f5;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.content-header h1 {
    font-size: 1.5rem;
    font-weight: 500;
}

.add-product-btn {
    background-color: #1B9C85;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.add-product-btn:hover {
    background-color: #158c77;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.5rem;
}

.product-card {
    height: auto;
    background: white;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f8f9fa;
}

.product-info {
    padding: 1rem;
}

.product-info h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
}

.price {
    color: #1B9C85;
    font-weight: 500;
    margin: 0.5rem 0;
}

.actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.edit-btn, .delete-btn {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.edit-btn {
    background-color: #f8f9fa;
    color: #333;
}

.edit-btn:hover {
    background-color: #e9ecef;
}

.delete-btn {
    background-color: #dc3545;
    opacity: 0.9;
    color: white;
}

.delete-btn:hover {
    background-color: #c82333;
}

@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    
    .dashboard-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        z-index: 100;
    }
    
    .logo {
        display: none;
    }
    
    .nav-links {
        flex-direction: row;
        justify-content: space-around;
    }
    
    .nav-link span {
        display: none;
    }
    
    .dashboard-content {
        padding: 1rem;
        padding-bottom: 5rem;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style> 