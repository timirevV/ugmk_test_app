import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80%;
  justify-content: center;
  align-items: center;
  gap: 36px;
`;

export const Graph = styled.div`
  display: flex;
  border: 2px solid;
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Filter = styled.div`
  display: flex;
  border: 2px solid;
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  justify-content: end;
`;

export const Label = styled.label`
  display: flex;
  gap: 16px;
`;

export const Text = styled.p`
  font-size: 16px;
`;
