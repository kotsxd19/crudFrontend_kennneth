import{
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
} from "../Services/categoryServices.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const tablebody = document.querySelector("#categoriesTable tbody");
    const form  = document.getElementById("categoryForm");
    const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
    const lbModal = document.getElementById("categoryModalLabel");
    const btnAdd = document.getElementById("btnAddCategory");

    loadCategories(); //Despues de cargar las constantes, cargamlos los registros

    btnAdd.addEventListener("click", ()=>{
        form.reset();
        form.categoryId.value = ""; //Al agregar no necesitamos ID
        lbModal.textContent = "Agregar Categoria";
        modal.show();
    });

    form.addEventListener("submit", async (e)=>{
        e.preventDefault(); //Evita que el formulario se envie 
        const id = form.categoryId.value; //Se obtiene el ID guardado en el form
        const data ={
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };

        try{
            if(id){
                await updateCategory(id, data);
            }
            else{
                await createCategory(data)
            }
            modal.hide();
            await loadCategories();
        }catch(err){
            console.log("Error al guardar la categoria: " + err);
            
        }
    });

    async function loadCategories() {
        try{
            const data = await getCategories();
            const categories = data.content;
            tablebody.innerHTML = '';//Vaciamos el tbody

            if(!categories || categories.length == 0){
                tablebody.innerHTML = '<td colspan="5">Actualmente no hay registro<td/>';
                return; //El codigo deja de ejecutarse
            }

            categories.forEach((cat)=>{
                const tr = document.createElement("tr") //Creamos un TR en JS

                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion || "Descripcion no asignado"}</td>
                    <td>${cat.fechaCreacion || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-square-pen">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>
                    
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-trash">
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M3 6h18"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;

                //Funcionalidad para boton de editar categoria 
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{

                    //Pasamos los datos del JSON a los campos del formulario
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;

                    //Aqui ponemos el titulo al formulario
                    lbModal.textContent = "Editar categoria";

                    modal.show();
                });

                //Funcionalidad para boton eliminar categoria 
                tr.querySelector(".delete-btn").addEventListener("click", async () => {
                    if (confirm("¿Desea eliminar la categoría?")) {
                      await deleteCategory(cat.idCategoria);
                      await loadCategories();
                    }
                  });

                tablebody.appendChild(tr); //al <tbody> le agrega el <tr> creado 

            });
        }
        catch(err) {
            	console.error("Error cargando categorias: ", err);
        }
    }


})