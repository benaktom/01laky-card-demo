export const formatValidityDate = (validityDate: string) => {
    const dateObject = new Date(validityDate);
    
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
};
