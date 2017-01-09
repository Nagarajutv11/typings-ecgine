<template>
	<div>
		<!-- Search header-->
		<div v-if="needHeader">

		</div>

		<!-- Filters -->
		<div>
			<filters-panel :filters="filters" :values="filterValues.values" @refresh="refresh"></filters-panel>
		</div>

		<!-- Table-->
		<div>
			<etable :columns="columns" :rows="rows" @cell-click="onCellClick" @row-click="onRowClick" @order-by-column="onOrderByColumn"></etable>
		</div>

		<!-- Pagination -->
		<div v-if="needPagination"></div>
	</div>
</template>
<script lang="ts" src="./ListViewControl.ts"></script>