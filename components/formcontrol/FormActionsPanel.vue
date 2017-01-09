<template>
	<div v-if="actions">
		<button v-for="action in prepareActions()" @click="onClick(action)">
			{{displayText(action)}}
		</button>
		<el-dialog title="Errors" v-model="dialogVisible" size="tiny">
			<span v-for="e in errors">{{e}}</br></span>
			<span slot="footer" class="dialog-footer">				
				<el-button type="primary" @click="dialogVisible = false">Ok</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script lang="ts" src="./FormActionsPanel.ts"></script>