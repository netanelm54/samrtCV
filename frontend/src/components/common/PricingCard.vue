<template>
	<div class="pricing-card" :class="{ selected: isSelected }" @click="$emit('select')">
		<div v-if="badge" :class="badgeClass">{{ badge }}</div>
		<div class="pricing-header">
			<h4>{{ title }}</h4>
			<div class="price">${{ price }}</div>
		</div>
		<p class="pricing-description">{{ description }}</p>
		<ul class="pricing-features">
			<li v-for="feature in features" :key="feature">✓ {{ feature }}</li>
		</ul>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	price: {
		type: [String, Number],
		required: true
	},
	description: {
		type: String,
		required: true
	},
	features: {
		type: Array,
		required: true
	},
	badge: {
		type: String,
		default: null
	},
	badgeType: {
		type: String,
		default: 'popular', // 'popular' or 'best-value'
		validator: value => ['popular', 'best-value'].includes(value)
	},
	isSelected: {
		type: Boolean,
		default: false
	}
});

defineEmits(['select']);

const badgeClass = computed(() => {
	return props.badgeType === 'best-value' ? 'best-value-badge' : 'popular-badge';
});
</script>

<style scoped>
.pricing-card {
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 12px;
	padding: 30px;
	cursor: pointer;
	transition: all 0.3s;
	text-align: center;
	position: relative;
}

.pricing-card:hover {
	border-color: #667eea;
	transform: translateY(-4px);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.pricing-card.selected {
	border-color: #667eea;
	background: #f8f9ff;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.popular-badge,
.best-value-badge {
	position: absolute;
	top: -12px;
	left: 50%;
	transform: translateX(-50%);
	color: white;
	padding: 6px 16px;
	border-radius: 20px;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.popular-badge {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.best-value-badge {
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.pricing-header {
	margin-bottom: 20px;
}

.pricing-header h4 {
	font-size: 1.5rem;
	color: #333;
	margin-bottom: 10px;
}

.price {
	font-size: 2rem;
	font-weight: 700;
	color: #667eea;
}

.pricing-description {
	color: #666;
	margin-bottom: 20px;
	font-size: 0.95rem;
}

.pricing-features {
	list-style: none;
	padding: 0;
	text-align: left;
	color: #333;
}

.pricing-features li {
	padding: 8px 0;
	font-size: 0.9rem;
}
</style>
