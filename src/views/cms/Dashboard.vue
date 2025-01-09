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
                <h1>Admin Paneli</h1>
                <div class="user-info">
                    <span>Admin</span>
                </div>
            </header>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Toplam Sipariş</h3>
                        <p>{{ completedOrders.length }}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Toplam Kazanç</h3>
                        <p>{{ totalEarnings }}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Toplam Müşteri</h3>
                        <p>{{ uniqueCustomers.length }}</p>
                    </div>
                </div>
            </div>
            
            <div class="recent-orders">
                <h2>Son Siparişler</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Sipariş No</th>
                                <th>Müşteri</th>
                                <th>Tutar</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in recentOrders" :key="order.orderUniqueCode">
                                <td>{{ order.orderUniqueCode }}</td>
                                <td>{{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</td>
                                <td class="green">${{ order.finalPrice }}</td>
                                <td>{{ new Date(order.cartInformation.expirationDate).toLocaleDateString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const router = useRouter()
const productStore = useProductStore()
const completedOrders = ref([])

onMounted(async () => {
    if (!localStorage.getItem('isAdmin')) {
        router.push('/cms/login')
        return
    }
    
    await productStore.getCompletedOrders()
    completedOrders.value = productStore.completedOrders
})

const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/cms/login')
}

const totalEarnings = computed(() => {
    return completedOrders.value
        .reduce((sum, order) => sum + parseFloat(order.finalPrice), 0)
        .toFixed(2)
})

const uniqueCustomers = computed(() => {
    const emails = new Set(completedOrders.value.map(order => order.shippingInfo.email))
    return Array.from(emails)
})

const recentOrders = computed(() => {
    return [...completedOrders.value]
        .sort((a, b) => new Date(b.cartInformation.expirationDate) - new Date(a.cartInformation.expirationDate))
        .slice(0, 5)
})
</script>

<style scoped>

img.logo{
    border-radius: 50%;
    object-fit: cover;
}

.green{
    color: #1B9C85;
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

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    font-size: 2rem;
    color: #1B9C85;
}

.stat-info h3 {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.stat-info p {
    font-size: 1.5rem;
    font-weight: 500;
    color: #1B9C85;
}

.recent-orders {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-orders h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
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
}
</style> 