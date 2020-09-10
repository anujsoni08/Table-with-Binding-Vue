<template>
  <div class="container">
    <div class="d-flex header">
      <p>
        Show
        <select @change="onPageLengthChange">
          <option v-for="item in itemsPerPageList" :key="item">
            {{
            item
            }}
          </option>
        </select>
        <span>Entries</span>
      </p>
      <p class="text-uppercase">
        Employee
        <span class="font-weight-bold">Details</span>
      </p>
      <div class="form-group">
        <input
          type="text"
          v-model="searchText"
          @input="onSearch"
          class="form-control"
          placeholder="Search"
        />
      </div>
    </div>
    <div>
      <table class="table table-bordered" v-if="!!totalLength">
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Employee Name</th>
            <th class="text-left">Employee Age</th>
            <th class="text-left">Employee Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.employee_name }}</td>
            <td>{{ item.employee_age }}</td>
            <td>{{ item.employee_salary }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!totalLength">
        <h1>No Data Available. Please search other text</h1>
      </div>
    </div>
    <div class="footer" v-if="!!totalLength">
      <p class="align-self-center">
        Showing
        <span class="font-weight-bold">{{ pageData.length }}</span> out of
        <span class="font-weight-bold">{{ totalLength }}</span>
      </p>
      <nav>
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            v-bind:class="{ disabled: pageNumber == 1 }"
            v-bind:style="{ cursor: pageNumber === 1 ? '' : 'pointer', }"
          >
            <a
              class="page-link"
              tabindex="-1"
              v-on:click="getSelectedPageData(pageNumber - 1)"
            >Previous</a>
          </li>
          <li
            v-for="n in totalPages"
            :key="n"
            class="page-item"
            v-bind:style="{ cursor: n === pageNumber ? '' : 'pointer', }"
            v-bind:class="{ disabled: n === pageNumber }"
          >
            <a class="page-link" v-on:click="getSelectedPageData(n)">{{ n }}</a>
          </li>
          <li
            class="page-item"
            v-bind:class="{ disabled: totalPages == pageNumber }"
            v-bind:style="{ cursor: totalPages === pageNumber ? '' : 'pointer', }"
          >
            <a class="page-link" v-on:click="getSelectedPageData(pageNumber + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style>
@import "./style.css";
</style>

<script>
import { axiosInstance } from "../../service/http";

export default {
  name: "Table",

  data: () => ({
    data: {},
    copyData: [],
    pageData: [],
    pagesLength: [],
    itemsPerPage: 5,
    itemsPerPageList: [],
    pageNumber: 1,
    totalPages: 1,
    totalLength: 1,
    searchText: "",
  }),

  methods: {
    async getData() {
      const res = await axiosInstance.get();
      return res.data;
    },
    async init() {
      const res = await this.getData();
      this.data = res.data;
      this.copyData = this.data;
      this.totalLength = this.copyData.length;
      this.pageData = this.copyData.slice(
        (this.pageNumber - 1) * this.itemsPerPage,
        this.pageNumber * this.itemsPerPage
      );
      this.totalPages = Math.ceil(this.totalLength / this.itemsPerPage);
      for (
        let i = this.itemsPerPage;
        i <= this.totalLength;
        i = i + this.itemsPerPage
      ) {
        this.itemsPerPageList.push(i);
      }
      for (let i = 1; i <= this.totalPages; i = i + 1) {
        this.pagesLength.push(i);
      }
    },
    getSelectedPageData(number) {
      console.log(number);
      this.pageData = this.copyData.slice(
        (number - 1) * this.itemsPerPage,
        number * this.itemsPerPage
      );
      this.pageNumber = number;
    },
    onPageLengthChange(event) {
      const number = parseInt(event.target.value);
      this.itemsPerPage = number;
      this.pagesLength = [];
      this.searchText = "";
      this.pageNumber = 1;
      this.pageData = this.data.slice(
        (this.pageNumber - 1) * this.itemsPerPage,
        this.pageNumber * this.itemsPerPage
      );
      this.totalPages = Math.ceil(this.totalLength / number);
      this.totalLength = this.data.length;
      for (let i = 1; i <= this.totalPages; i = i + 1) {
        this.pagesLength.push(i);
      }
    },
    onSearch() {
      const debounce = this.debounceSearch(1000);
      debounce();
    },
    debounceSearch(delay) {
      let timer;
      let context = this;
      return function () {
        clearTimeout(timer);
        setTimeout(() => {
          if (context.searchText.length) {
            context.copyData = context.data.filter(
              (data) =>
                data.employee_name
                  .toLowerCase()
                  .indexOf(context.searchText.toLowerCase()) > -1
            );
          } else {
            context.copyData = context.data;
          }
          context.pageData = context.copyData.slice(
            (context.pageNumber - 1) * context.itemsPerPage,
            context.pageNumber * context.itemsPerPage
          );
          context.totalLength = context.copyData.length;
          context.totalPages = Math.ceil(
            context.totalLength / context.itemsPerPage
          );
        }, delay);
      };
    },
  },

  mounted() {
    this.init();
  },
};
</script>
