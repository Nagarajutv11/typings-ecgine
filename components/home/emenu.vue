<template>
	<div>
		<!--<ul class="nav nav-pills">
			<esubmenu v-if="menus" v-for="item in menus" :menu="item"></esubmenu>
		</ul>-->

		<ul class="nav nav-pills">
			<li v-for="s1 in menus" class="dropdown">
				<!--<a v-if="!s1.submenus" href="#">{{s1.name}}</a>-->
				<router-link v-if="!s1.submenus" :to="{name:'home',params:{appid:appid,viewid:s1.command}}">{{s1.name}}</router-link>
				<a v-if="s1.submenus" href="#" data-toggle="dropdown" class="dropdown-toggle">{{s1.name}} <b class="caret"></a>
				<ul v-if="s1.submenus" class="dropdown-menu">
					<li v-for="s2 in s1.submenus" :class="'dropdown'+(s2.submenus?'-submenu':'')">
						<!--<a href="#">{{s2.name}}</a>-->
						<router-link :to="{name:'home',params:{appid:appid,viewid:s2.command}}">{{s2.name}}</router-link>
						<ul v-if="s2.submenus" class="dropdown-menu">
							<li v-for="s3 in s2.submenus" :class="'dropdown'+(s3.submenus?'-submenu':'')">
								<!--<a href="#">{{s3.name}}</a>-->
								<router-link :to="{name:'home',params:{appid:appid,viewid:s3.command}}">{{s3.name}}</router-link>
								<ul v-if="s3.submenus" class="dropdown-menu">
									<li v-for="s4 in s3.submenus" :class="'dropdown'+(s4.submenus?'-submenu':'')">
										<!--<a href="#">{{s4.name}}</a>-->
										<router-link :to="{name:'home',params:{appid:appid,viewid:s4.command}}">{{s4.name}}</router-link>
										<ul v-if="s4.submenus" class="dropdown-menu">
											<li v-for="s5 in s4.submenus" :class="'dropdown'+(s5.submenus?'-submenu':'')">

											</li>
										</ul>
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>

		<!--<el-menu theme="dark" v-if="appid" default-active="1" mode="horizontal" @select="handleSelect">
			<div v-for="(t1,i1) in menus">
				<el-menu-item :index="''+(i1+1)" v-if="!t1.submenus">
					<router-link :to="{name:'home',params:{appid:appid,viewid:t1.command}}">{{t1.name}}</router-link>
				</el-menu-item>
				<el-submenu :index="''+(i1+1)" v-if="t1.submenus">
					<template slot="title">{{t1.name}}</template>
					<div v-for="(t2,i2) in t1.submenus">
						<el-menu-item :index="(i1+1)+'-'+(i2+1)" v-if="!t2.submenus">
							<router-link :to="{name:'home',params:{appid:appid,viewid:t2.command}}">{{t2.name}}</router-link>
						</el-menu-item>
						<el-submenu :index="(i1+1)+'-'+(i2+1)" v-if="t2.submenus">
							<template slot="title">{{t2.name}}</template>
							<div v-for="(t3,i3) in t2.submenus">
								<el-menu-item :index="(i1+1)+'-'+(i2+1)+'-'+(i3+1)" v-if="!t3.submenus">
									<router-link :to="{name:'home',params:{appid:appid,viewid:t3.command}}">{{t3.name}}</router-link>
								</el-menu-item>
								<el-submenu :index="(i1+1)+'-'+(i2+1)+'-'+(i3+1)" v-if="t3.submenus">
									<template slot="title">{{t3.name}}</template>
									<div v-for="(t4,i4) in t3.submenus">
										<el-menu-item :index="(i1+1)+'-'+(i2+1)+'-'+(i3+1)+'-'+(i4+1)" v-if="!t4.submenus">
											<router-link :to="{name:'home',params:{appid:appid,viewid:t4.command}}">{{t4.name}}</router-link>
										</el-menu-item>
									</div>
								</el-submenu>
							</div>
						</el-submenu>
					</div>
				</el-submenu>
			</div>			
		</el-menu>-->
	</div>
</template>
<script lang="ts" src="./emenu.ts"></script>