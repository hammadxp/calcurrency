import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

const currencyCodes = ["EUR", "GBP", "JPY"]

export function SocialImage() {
  return (
    <div
      style={{
        alignItems: "stretch",
        backgroundColor: "#f4f1e7",
        color: "#18352b",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: 56,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: 36,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>
          {PROJECT_DETAILS.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.04 }}>
            One amount.
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.04 }}>
            Multiple currencies.
          </div>
          <div style={{ color: "#4c675a", fontSize: 24, marginTop: 28 }}>
            Convert and compare in one place.
          </div>
        </div>
        <div style={{ color: "#4c675a", display: "flex", fontSize: 20 }}>
          calcurrency.hammadxp.com
        </div>
      </div>
      <div
        style={{
          alignItems: "stretch",
          backgroundColor: "#18352b",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 28,
          width: 346,
        }}
      >
        <div
          style={{
            backgroundColor: "#d1ead4",
            borderRadius: 18,
            color: "#18352b",
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            justifyContent: "space-between",
            marginBottom: 18,
            padding: 22,
          }}
        >
          <span>USD</span>
          <span>100</span>
        </div>
        {currencyCodes.map((code) => (
          <div
            key={code}
            style={{
              backgroundColor: "#f4f1e7",
              borderRadius: 18,
              color: "#18352b",
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              justifyContent: "space-between",
              marginBottom: 12,
              padding: 22,
            }}
          >
            <span>{code}</span>
            <span style={{ color: "#5b7769" }}>→</span>
          </div>
        ))}
      </div>
    </div>
  )
}
