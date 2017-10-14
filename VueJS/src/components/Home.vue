<script>
  export default {
    name: 'Home'
  }
</script>

<template>
  <div id="main">
    <section>
      <h2>What is Contract Builder?</h2>
      <p>Contract Builder is a free open-source project that allows anyone to easily maintain and build any kind of contract (legal documents, lawsuit, rent, agreements, construction and so on) or even resumes using Google Spreadsheets. This was develop as a personal project to help a friend who was struggling spending up to an hour to make a custom contract, now she is able to do it in less than 5 minutes. Hooray!</p>
    </section>
    <section>
      <h2>Features</h2>
      <p>Contract Builder have plenty features to help you build that borring and complex contract withing minutes. Check below</p>
      <ul>
        <li>Parse data from Google Spreadsheet</li>
        <li>Use HTML to enhance your contract</li>
        <li>
          5 different types of "blocks"
          <ul>
            <li>Title</li>
            <li>Subtitle</li>
            <li>Paragraph</li>
            <li>List</li>
            <li>Page Break</li>
          </ul>
        </li>
        <li>Download the contract as .docx</li>
      </ul>
    </section>
    <section>
      <h2>Usage</h2>
      <p>First of all you need to create a Google Spreadsheet or .xls file following the same rules as <a href="https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/">this one</a> (you can <a href="https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/copy">make a copy</a> or <a href="https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/export?format=xlsx&gid=0">download it</a> if you like) and populate with your contract informations.</p>

      <ul>
        <li><b>id:</b> The identification of the row, it can be anything but must be unique</li>
        <li><b>description:</b> Short description of the row</li>
        <li><b>content:</b> The actual content that will appear on the contract. Use HTML tags to format this content</li>
        <li>
          <b>type:</b> Type of the block
          <ul>
            <li><b>title:</b> A title for the contract</li>
            <li><b>title-center:</b> A centralized title for the contract</li>
            <li><b>subtitle:</b> A subtitle for the contract</li>
            <li><b>subtitle-center:</b> A centralized subtitle for the contract</li>
            <li><b>paragraph:</b> A paragraph for the contract</li>
            <li><b>paragraph-center:</b> A centralized paragraph for the contract</li>
            <li><b>page-break:</b> A page break</li>
            <li><b>list:</b> A basic list</li>
            <li><b>numeric-list:</b> A list with a incremented number before it</li>
            <li><b>circle-list:</b> A list with a circle before it</li>
            <li><b>square-list:</b> A list with a square before it</li>
          </ul>
        </li>
        <li><b>depends:</b> Put the identification (id) of the row that this row must belong</li>
        <li><b>mandatory:</b> Make the row mandatory, meaning it will not ask to be added to the contract</li>
        <li><b>disabled:</b> Disable row</li>
      </ul>

      <p>So whenever you want a part of the contract to be only available when certain other part is on the contract, you should use the depends field. One row can depend of another row that also depends on another and so on. Use your creativity.</p>
    </section>
  </div>
</template>

<style scoped>
  #main section{
    background-color: rgba(44, 62, 80, 0.51);
    margin-top: 15px;
    padding: 20px;
  }
  #main {
    margin: 0 auto;
    width: 1024px;
    color: #FFFFFF;
    text-align: justify;
  }
  #main p {
    font-size: 15pt;
  }
  #main h2 {
    font-weight: bold;
  }
</style>
