<template>
    <div class="dashboard">
        <Navigation />
        <div class="dashboard-content">
            <div class="content-header">
                <h1>Ürünler</h1>
                <button class="add-product-btn">
                    <i class="fas fa-plus"></i> Yeni Ürün Ekle
                </button>
            </div>
            
            <div class="products-table-container">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Ürün Görseli</th>
                                <th>Ürün Adı</th>
                                <th>Fiyat</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id">
                                <td>
                                    <div class="product-image" :style="{ 'background-image': `url(/images/${product.photo[0]})` }"></div>
                                </td>
                                <td>{{ product.name }}</td>
                                <td class="price">${{ product.price }}</td>
                                <td>
                                    <div class="actions">
                                        <button class="edit-btn" @click="editProduct(product)">
                                            <i class="fas fa-edit"></i> Düzenle
                                        </button>
                                        <button class="delete-btn" @click="deleteProduct(product.id)">
                                            <i class="fas fa-trash"></i> Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import Navigation from '../../components/cms/Navigation.vue'

const router = useRouter()
const productStore = useProductStore()
const products = ref([])

onMounted(async () => {
    if (!localStorage.getItem('isAdmin')) {
        router.push('/cms/login')
        return
    }
    
    await productStore.getProducts()
    products.value = productStore.products
})

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
.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
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
    opacity: 0.9;
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

.products-table-container {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-responsive {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    font-weight: 500;
    color: #666;
    background-color: #f8f9fa;
}

.product-image {
    width: 80px;
    height: 80px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #eee;
}

.price {
    color: #1B9C85;
    font-weight: 500;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn, .delete-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.9rem;
    transition: background-color 0.3s;
    opacity: 0.9;
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
    color: white;
}

.delete-btn:hover {
    background-color: #c82333;
}

@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    
    .dashboard-content {
        padding: 1rem;
        padding-bottom: 5rem;
    }

    .content-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .add-product-btn {
        width: 100%;
        justify-content: center;
    }

    .products-table-container {
        padding: 1rem;
    }

    th, td {
        padding: 0.75rem;
        font-size: 0.9rem;
    }

    .product-image {
        width: 60px;
        height: 60px;
    }

    .actions {
        flex-direction: column;
    }

    .edit-btn, .delete-btn {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .content-header h1 {
        font-size: 1.25rem;
        text-align: center;
    }

    .table-responsive {
        margin: 0 -1rem;
    }

    table {
        font-size: 0.85rem;
    }

    th, td {
        padding: 0.5rem;
    }

    .product-image {
        width: 50px;
        height: 50px;
    }

    .actions {
        gap: 0.25rem;
    }

    .edit-btn, .delete-btn {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
    }
}
</style> 