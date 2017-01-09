<template>
	<div>
		<label>{{value1}}</label>
		<input :disabled="disable" type="number" :value="value" @change="onChange">
	</div>
</template>
<script lang="ts" src="./AmountField.ts"></script>