<template>
	<div>
		<etable :columns="getColumns()" :rows="rows" >
		</etable>
		<button @click="addNewRow()">+</button>
	</div>
</template>
<script lang="ts" src="./gridtable.ts"></script>