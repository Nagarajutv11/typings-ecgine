<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" role="dialog" :id="id">
            <eview v-if="input" :input="input" :closeHandler="addCloseListener" @close="onClose"></eview>
        </div>
        <edialog v-if="show"></edialog>
    </div>
</template>
<script lang="ts" src="./edialog.ts"></script>