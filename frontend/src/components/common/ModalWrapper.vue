<template>
	<Teleport to="body">
		<div
			v-if="show"
			ref="overlayRef"
			class="modal-wrapper-overlay"
			role="dialog"
			:aria-modal="show"
			:aria-labelledby="titleId"
			:aria-describedby="descriptionId"
			@click.self="handleOverlayClick"
			@keydown="handleKeydown"
		>
			<div
				ref="containerRef"
				class="modal-wrapper-container"
				:class="containerClass"
				tabindex="-1"
				role="document"
			>
				<slot></slot>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	closeOnOverlay: {
		type: Boolean,
		default: true
	},
	closeOnEscape: {
		type: Boolean,
		default: true
	},
	titleId: {
		type: String,
		default: ''
	},
	descriptionId: {
		type: String,
		default: ''
	},
	containerClass: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['close']);

const overlayRef = ref(null);
const containerRef = ref(null);
let previousActiveElement = null;
let focusableElements = [];

// Get all focusable elements within the modal
const getFocusableElements = () => {
	if (!containerRef.value) return [];

	const selector = [
		'a[href]',
		'button:not([disabled])',
		'textarea:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	].join(', ');

	return Array.from(containerRef.value.querySelectorAll(selector)).filter(el => {
		const style = window.getComputedStyle(el);
		return style.display !== 'none' && style.visibility !== 'hidden';
	});
};

// Trap focus within modal
const trapFocus = event => {
	if (!containerRef.value || !props.show) return;

	focusableElements = getFocusableElements();
	if (focusableElements.length === 0) return;

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	if (event.key === 'Tab') {
		if (event.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}
};

// Save the previously focused element and focus the modal
const focusModal = async () => {
	await nextTick();
	previousActiveElement = document.activeElement;

	if (containerRef.value) {
		focusableElements = getFocusableElements();
		if (focusableElements.length > 0) {
			focusableElements[0].focus();
		} else {
			containerRef.value.focus();
		}
	}
};

// Restore focus to the previously focused element
const restoreFocus = () => {
	if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
		previousActiveElement.focus();
	}
};

// Prevent body scroll when modal is open
const preventBodyScroll = () => {
	document.body.style.overflow = 'hidden';
	document.body.style.paddingRight = '0px'; // Adjust for scrollbar if needed
};

const restoreBodyScroll = () => {
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
};

// Handle keyboard events
const handleKeydown = event => {
	if (event.key === 'Escape' && props.closeOnEscape) {
		emit('close');
	} else if (event.key === 'Tab') {
		trapFocus(event);
	}
};

// Handle overlay click
const handleOverlayClick = () => {
	if (props.closeOnOverlay) {
		emit('close');
	}
};

// Watch for show changes
watch(
	() => props.show,
	newValue => {
		if (newValue) {
			preventBodyScroll();
			focusModal();
			// Add focus trap listener
			document.addEventListener('keydown', trapFocus);
		} else {
			restoreBodyScroll();
			restoreFocus();
			// Remove focus trap listener
			document.removeEventListener('keydown', trapFocus);
		}
	}
);

onMounted(() => {
	if (props.show) {
		preventBodyScroll();
		focusModal();
		document.addEventListener('keydown', trapFocus);
	}
});

onUnmounted(() => {
	restoreBodyScroll();
	document.removeEventListener('keydown', trapFocus);
});
</script>

<style scoped>
.modal-wrapper-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 20px;
	animation: fadeIn 0.2s ease-out;
	width: 100%;
}
.modal-wrapper-container {
	width: 100%;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.modal-wrapper-container {
	outline: none;
}

.modal-wrapper-container:focus {
	outline: none;
}
</style>
