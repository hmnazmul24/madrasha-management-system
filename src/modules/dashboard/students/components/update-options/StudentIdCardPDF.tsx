// components/pdf/StudentIdCard.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PDFImage,
  Font,
} from "@react-pdf/renderer";
import { StudentIdType } from "../../types";

// Optional: Bangla font registration here if using fonts
Font.register({ family: "Bangla", src: "/fonts/bangla.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  card: {
    position: "relative",
    fontFamily: "Bangla",
  },

  idBackground: {
    width: 189,
    height: 321,
    border: "2px solid black",
  },
  profile: {
    position: "absolute",
    top: 53,
    left: 50,
    height: 90,
    width: 90,
    borderRadius: 50,
    objectFit: "cover",
  },
});

// const imageUrlCoude =
//   "https://res.cloudinary.com/ddyrlplxn/image/upload/v1743291862/student/rf2kfq6gkee3n6n7t5ij.png";
export const StudentIdCardPDF = ({
  name,
  course,
  session,
  id,
  madrashaName,
  imageUrl,
}: StudentIdType) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <PDFImage style={styles.idBackground} src={"/id-background.png"} />
          <PDFImage
            style={styles.profile}
            src={imageUrl || "/admin-user.jpg"}
          />
          <View
            style={{
              position: "absolute",
              top: 153,
              width: 189,
              fontSize: 10,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              name: {name}
            </Text>
            <Text>id: {id}</Text>
            <Text>course: {course}</Text>
            <Text>session: {session.split("_").join(" ")}</Text>

            <Text style={{ fontSize: 9, paddingTop: 7, textAlign: "center" }}>
              {madrashaName}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
