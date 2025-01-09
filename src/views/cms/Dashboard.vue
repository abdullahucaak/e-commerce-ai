<template>
    <div class="dashboard">
        <Navigation />
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
import Navigation from '../../components/cms/Navigation.vue'

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
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
})
</script>

<style scoped>
.green{
    color: #1B9C85;
}

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
    font-weight: 500;
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
    font-weight: 500;
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
    
    .dashboard-content {
        padding: 1rem;
        padding-bottom: 5rem;
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .content-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .content-header h1 {
        font-size: 1.5rem;
        margin: 0;
    }

    .user-info {
        font-size: 0.9rem;
        opacity: 0.8;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-card {
        padding: 1.25rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .stat-icon {
        font-size: 1.75rem;
    }

    .stat-info h3 {
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }

    .stat-info p {
        font-size: 1.25rem;
    }

    .recent-orders {
        padding: 1.25rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .recent-orders h2 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        opacity: 0.9;
    }

    .table-responsive {
        margin: 0 -1rem;
        padding: 0 1rem;
        width: calc(100% + 2rem);
    }

    table {
        font-size: 0.9rem;
        border-collapse: separate;
        border-spacing: 0;
    }

    th {
        background-color: #f8f9fa;
        padding: 0.75rem 0.5rem;
        font-weight: 500;
        color: #666;
        white-space: nowrap;
    }

    td {
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid #eee;
    }

    td:first-child {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    tr:last-child td {
        border-bottom: none;
    }
}

@media (max-width: 480px) {
    .content-header h1 {
        font-size: 1.25rem;
    }

    .stat-card {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem;
    }

    .stat-icon {
        margin: 0;
        font-size: 1.5rem;
    }

    .stat-info h3 {
        font-size: 0.8rem;
    }

    .stat-info p {
        font-size: 1.2rem;
    }

    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin: 0 -1.25rem;
        padding: 0 1.25rem;
    }

    table {
        min-width: 480px;
        font-size: 0.85rem;
    }

    th, td {
        padding: 0.75rem 0.5rem;
    }

    td:first-child {
        max-width: 100px;
    }
}
</style> 