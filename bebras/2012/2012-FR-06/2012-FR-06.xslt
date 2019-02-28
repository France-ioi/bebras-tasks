<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="text"/>
  <xsl:template match="/">
    <xsl:text>digraph G {
</xsl:text>
    <xsl:apply-templates select="//div[@class='item_2012_FR_06']" />
    <xsl:text>}
</xsl:text>
  </xsl:template>
  
  <xsl:template match="div[@class='item_2012_FR_06']">
    <xsl:text>    </xsl:text>
    <xsl:value-of select="div[@class='takes_2012_FR_06']"/>
    <xsl:text> -> </xsl:text>
    <xsl:value-of select="div[@class='gives_2012_FR_06']"/>
    <xsl:text> [label="</xsl:text>
    <xsl:value-of select="div[@class='person_2012_FR_06']"/>
    <xsl:text>"];
</xsl:text>
  </xsl:template>

</xsl:stylesheet>

      