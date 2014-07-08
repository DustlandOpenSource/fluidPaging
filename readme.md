#Fluid Paging
Fluid paging plugin with jQuery.

The plugin allows for paging to fit a given container. The paging can be generated either on the server, or the plugin can generate the pages

##Usage
$('.paging-list').fluidPaging();

##Options
**nextArrowClass**: CSS Class for the next arrow

**nextArrowClass**: CSS Class for the previous arrow

**arrowTemplate**: A function for creating the template used by the next & prev arrows.

**activeClass**: CSS Class for the active/current selected page

**dotClass**: CSS Class for the dots

**dotTemplate**: The template to use for the dots container. This will be passed width as a variable and has access to any of the options by using the settings object (eg. settings.dotClass)

**fitContainer**: If there is space leftover between the container and the page buttons shown, should the container distribute that difference amongst the visible page buttons to make it fit the container perfectly

**generatePages**: Should the plugin generate a list of page numbers or will the server do this?

**activePageNumber**: The index for the active Page. Only used if generatePages is true

**numPages**: The number of pages to generate. Only used if generatePages is true

**pageTemplate**: A template used to generate the pages. Only used if generatePages is true
