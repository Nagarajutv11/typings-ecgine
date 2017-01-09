<template>
	<div v-if="form">
		<!-- titleAndActionsPane -->
		<div>
			<div>
				<!-- titlePane -->
				<div>
					<span>{{form.name}}</span>
				</div>
				<!-- actionsPane -->
				<form-actions-panel v-if="modelpane&&value" :db="input.databaseService" :ins="value" :isEdit="isEdit" :entity="entity" :actions="form.actions" :handler="handler"
					:context="handlerContext" @close="onCloseClick" @new="onNewClick" @saved="saveSuccess" @edit="onEditClick"></form-actions-panel>
			</div>
			<!-- statusPane -->
			<div>
				<!-- TODO -->
			</div>
		</div>
		<!-- ScrollPane -->
		<div>
			<!-- model pane -->
			<model-pane-component v-if="modelPaneInput" :modelpane="modelpane" :input="modelPaneInput" >
			</model-pane-component>
		</div>
		<form-actions-panel v-if="modelpane&&value" :db="input.databaseService" :ins="value" :isEdit="isEdit" :entity="entity" :actions="form.actions" :handler="handler"
			:context="handlerContext" @close="onCloseClick" @new="onNewClick" @saved="saveSuccess" @edit="onEditClick"></form-actions-panel>
	</div>
</template>
<script lang="ts" src="./FormControl.ts"></script>
<style>
	div#pp {
		column-count: 3;
	}
</style>