

export const envOptions = reactive(import.meta.env.VITE_ENV === 'test' ? [
    { label: 'web端', value: '1' },
    { label: '移动端', value: '2' },
    { label: 'web2.0', value: '3' }
] : [
    { label: 'web端', value: '1' },
    { label: '移动端', value: '2' }
])