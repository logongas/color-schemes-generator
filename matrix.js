/* 
 * Operaciones con matrices
 */

function resolveEquationsSystem(matrix,vector) {
    
    var detMatrix=calcDeterminant(matrix);
    
    if (detMatrix===0) {
        alert("El determinate es cero");
        throw Error("El determinate es cero");
    }
    
    var detMatrix0=calcDeterminantMatrixVector(matrix,vector,0);
    var detMatrix1=calcDeterminantMatrixVector(matrix,vector,1);
    var detMatrix2=calcDeterminantMatrixVector(matrix,vector,2);
    
    return [detMatrix0/detMatrix,detMatrix1/detMatrix,detMatrix2/detMatrix];
    
}

function calcDeterminantMatrixVector(matrix,vector,index) {
    var newMatrix=JSON.parse(JSON.stringify(matrix));
    newMatrix[0][index]=vector[0];
    newMatrix[1][index]=vector[1];
    newMatrix[2][index]=vector[2];
    var detNewMatrix=calcDeterminant(newMatrix);
    
    
    return detNewMatrix;
    
}



function calcDeterminant(m) {
    
    var result=
            (m[0][0]*m[1][1]*m[2][2])+
            (m[1][0]*m[2][1]*m[0][2])+
            (m[2][0]*m[0][1]*m[1][2])-
            (m[0][2]*m[1][1]*m[2][0])-
            (m[1][2]*m[2][1]*m[0][0])-
            (m[2][2]*m[0][1]*m[1][0]);
    
    return result;
    
}


