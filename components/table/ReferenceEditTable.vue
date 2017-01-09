<template>
	<div>
		<etable :columns="getColumns()" :rows="rows" @propertyChange="onPropertyChange">
		</etable>
		<button v-if="isEditable()" @click="addNewRow()">+</button>
	</div>
</template>
<script lang="ts" src="./ReferenceEditTable.ts"></script>