import Swal from "sweetalert2"
export const success = async (message:string) => {
   

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        background: '#059669',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        color: 'white',
        width:'fit-content'
        
    })

    await Toast.fire({
        icon:'success',
        title:message
    })
      
}
export const error = async (error:string) => {
   
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        background: '#e11d48',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 2000,
        timerProgressBar: true,
        color: 'white',
        width:'fit-content'
        
      })
  
    await Toast.fire({
    icon: 'error',
    title:error
    })

      
}