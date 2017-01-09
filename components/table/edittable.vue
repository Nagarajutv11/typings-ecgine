<template>
	<div>
		<etable :columns="getColumns()" :rows="allRows" @propertyChange="onPropertyChange">
		</etable>
		<button v-if="isEditable()" @click="addNewRow()">+</button>
	</div>
</template>
<script lang="ts" src="./edittable.ts"></script>