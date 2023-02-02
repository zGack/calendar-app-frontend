import calendarApi from "../../src/api/calendarApi"

describe('Pruebas en CalendarApi', () => { 
  test('debe tener la configuracion por defecto', () => { 
    // console.log(process.env.VITE_API_URL);
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
  })

  test('debe tener el x-api-key en todas las peticiones', async() => { 
    const token = 'ABCxyz';

    localStorage.setItem('token', token);
    const res = await calendarApi.get('/auth');
    
    expect(res.config.headers['x-api-key']).toBe(token);
  })
})