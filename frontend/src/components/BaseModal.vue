<template>
	<ModalWrapper
		:show="show"
		:close-on-overlay="closeOnOverlay"
		:close-on-escape="closeOnEscape"
		:title-id="titleId"
		:description-id="descriptionId"
		@close="handleClose"
	>
		<div class="modal-container" :class="modalClass">
			<button
				v-if="showCloseButton"
				ref="closeButtonRef"
				class="modal-close"
				@click="handleClose"
				aria-label="Close modal"
			>
				×
			</button>
			<slot></slot>
		</div>
	</ModalWrapper>
</template>

<script setup>
import { computed, ref } from 'vue';
import ModalWrapper from './common/ModalWrapper.vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	showCloseButton: {
		type: Boolean,
		default: true
	},
	closeOnOverlay: {
		type: Boolean,
		default: true
	},
	closeOnEscape: {
		type: Boolean,
		default: true
	},
	size: {
		type: String,
		default: 'medium', // 'small', 'medium', 'large', 'full'
		validator: value => ['small', 'medium', 'large', 'full'].includes(value)
	},
	titleId: {
		type: String,
		default: ''
	},
	descriptionId: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['close']);

const closeButtonRef = ref(null);

const handleClose = () => {
	emit('close');
};

const modalClass = computed(() => {
	return {
		'modal-small': props.size === 'small',
		'modal-medium': props.size === 'medium',
		'modal-large': props.size === 'large',
		'modal-full': props.size === 'full'
	};
});
</script>

<style scoped>
.modal-container {
	background: white;
	border-radius: 16px;
	padding: 40px;
	width: 100%;
	position: relative;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	animation: slideIn 0.3s ease-out;
	max-height: 90vh;
	overflow-y: auto;
	margin: auto;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.modal-small {
	max-width: 420px;
}

.modal-medium {
	max-width: 560px;
}

.modal-large {
	max-width: 700px;
}

.modal-full {
	max-width: 95vw;
}

.modal-close {
	position: absolute;
	top: 15px;
	right: 15px;
	background: none;
	border: none;
	font-size: 2rem;
	color: var(--color-text-lighter);
	cursor: pointer;
	line-height: 1;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.2s;
	z-index: 10;
}

.modal-close:hover {
	background: #f0f0f0;
	color: var(--color-text);
}

/* Scrollbar styling for modal content */
.modal-container::-webkit-scrollbar {
	width: 8px;
}

.modal-container::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
	background: #555;
}

@media (max-width: 768px) {
	.modal-container {
		padding: 20px;
	}
}
</style>
