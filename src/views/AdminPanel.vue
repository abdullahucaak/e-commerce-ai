<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>Admin Paneli</h1>
      <button @click="logout" class="logout-btn">Çıkış Yap</button>
    </div>
    <div class="admin-content">
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Toplam Sipariş</h3>
          <p>{{ completedOrders.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Toplam Abone</h3>
          <p>{{ subscribers.length }}</p>
        </div>
      </div>
      
      <div class="recent-orders">
        <h2>Son Siparişler</h2>
        <div class="orders-list">
          <div v-for="order in recentOrders" :key="order.orderUniqueCode" class="order-item">
            <div class="order-header">
              <span>Sipariş No: {{ order.orderUniqueCode }}</span>
              <span>{{ formatPrice(order.finalPrice) }} ₺</span>
            </div>
            <div class="order-details">
              <p>{{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</p>
              <p>{{ order.shippingInfo.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const completedOrders = ref([])
const subscribers = ref([])

const logout = () => {
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('adminData')
  router.push('/admin')
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const getCompletedOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3000/completedOrders')
    completedOrders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const getSubscribers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/subscribers')
    subscribers.value = response.data
  } catch (error) {
    console.error('Error fetching subscribers:', error)
  }
}

const recentOrders = computed(() => {
  return completedOrders.value.slice(-5).reverse()
})

onMounted(async () => {
  await getCompletedOrders()
  await getSubscribers()
})
</script>

<style scoped>
.admin-panel {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  color: #4a90e2;
}

.recent-orders {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-orders h2 {
  margin-bottom: 1rem;
  color: #333;
}

.order-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.order-details {
  color: #666;
}

.order-details p {
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 1rem;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style> 