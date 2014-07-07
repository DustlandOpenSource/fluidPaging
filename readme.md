#Fluid Paging
Fluid paging plugin with jQuery.

The plugin allows for paging to fit a given container. The paging can be generated either on the server, or the plugin can generate the pages

##Usage
$('.paging-list').fluidPaging();

##Options

	__nextArrowClass__ - CSS Class for the next arrow

	__nextArrowClass__ - CSS Class for the previous arrow

	__arrowTemplate__ - A function for creating the template used by the next & prev arrows.

	__activeClass__  - CSS Class for the active/current selected page

	__dotClass__ - CSS Class for the dots

	__dotTemplate__ - The template to use for the dots container. This will be passed width as a variable and has access to any of the options by using the settings object (eg. settings.dotClass)

	__fitContainer__ - If there is space leftover between the container and the page buttons shown, should the container distribute that difference amongst the visible page buttons to make it fit the container perfectly

	__generatePages__ - Should the plugin generate a list of page numbers or will the server do this?

	__activePageNumber__ - The index for the active Page. Only used if generatePages is true

	__numPages__ - The number of pages to generate. Only used if generatePages is true

	__pageTemplate__ - A template used to generate the pages. Only used if generatePages is true